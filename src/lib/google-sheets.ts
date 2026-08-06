export interface GoogleSheetsConfig {
  serviceAccountEmail: string;
  privateKey: string;
  spreadsheetId: string;
  bookingsSheetName: string;
  customersSheetName: string;
}

export function isGoogleSheetsConfigured(config: {
  serviceAccountEmail?: string;
  privateKey?: string;
  spreadsheetId?: string;
}): config is GoogleSheetsConfig {
  return Boolean(config.serviceAccountEmail && config.privateKey && config.spreadsheetId);
}

export interface BookingRow {
  submittedAt: string;
  name: string;
  phone: string;
  department: string;
  service: string;
  page: string;
  language: string;
}

interface SheetProperties {
  sheetId: number;
  title: string;
}

interface SpreadsheetMetadata {
  sheets?: Array<{ properties: SheetProperties }>;
}

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let cachedToken: { value: string; expiresAt: number } | undefined;

function toBase64Url(value: string | ArrayBuffer): string {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodePem(privateKey: string): ArrayBuffer {
  const pem = privateKey
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const binary = atob(pem);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

async function getAccessToken(config: GoogleSheetsConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = toBase64Url(JSON.stringify({
    iss: config.serviceAccountEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }));
  const unsignedToken = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    decodePem(config.privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken),
  );

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedToken}.${toBase64Url(signature)}`,
    }),
  });
  if (!response.ok) throw new Error(`Google authentication failed (${response.status})`);

  const token = await response.json() as { access_token?: string; expires_in?: number };
  if (!token.access_token) throw new Error('Google authentication returned no access token');
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in ?? 3600) * 1000,
  };
  return token.access_token;
}

async function googleRequest<T>(
  config: GoogleSheetsConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = await getAccessToken(config);
  const response = await fetch(`${SHEETS_API}/${encodeURIComponent(config.spreadsheetId)}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function cell(value: string) {
  return { userEnteredValue: { stringValue: value } };
}

function row(values: string[]) {
  return { values: values.map(cell) };
}

async function getSheets(config: GoogleSheetsConfig): Promise<SheetProperties[]> {
  const metadata = await googleRequest<SpreadsheetMetadata>(
    config,
    '?fields=sheets.properties(sheetId,title)',
  );
  return metadata.sheets?.map(({ properties }) => properties) ?? [];
}

async function ensureSheets(config: GoogleSheetsConfig): Promise<Map<string, number>> {
  let sheets = await getSheets(config);
  const required = [
    { title: config.bookingsSheetName, columns: 7 },
    { title: config.customersSheetName, columns: 3 },
  ];
  const missing = required.filter(({ title }) => !sheets.some((sheet) => sheet.title === title));

  if (missing.length) {
    await googleRequest(config, ':batchUpdate', {
      method: 'POST',
      body: JSON.stringify({
        requests: missing.map(({ title, columns }) => ({
          addSheet: { properties: { title, gridProperties: { rowCount: 1000, columnCount: columns } } },
        })),
      }),
    });
    sheets = await getSheets(config);
  }

  const ids = new Map(sheets.map(({ title, sheetId }) => [title, sheetId]));
  for (const { title } of required) {
    if (ids.get(title) === undefined) throw new Error(`Google Sheet tab was not created: ${title}`);
  }
  return ids;
}

function headerRequests(config: GoogleSheetsConfig, sheetIds: Map<string, number>) {
  return [
    {
      updateCells: {
        range: { sheetId: sheetIds.get(config.bookingsSheetName)!, startRowIndex: 0, endRowIndex: 1 },
        rows: [row(['Submitted At', 'Name', 'Phone', 'Department', 'Service', 'Page', 'Language'])],
        fields: 'userEnteredValue',
      },
    },
    {
      updateCells: {
        range: { sheetId: sheetIds.get(config.customersSheetName)!, startRowIndex: 0, endRowIndex: 1 },
        rows: [row(['Registered At', 'Name', 'Phone'])],
        fields: 'userEnteredValue',
      },
    },
  ];
}

export async function initializeBookingSheets(config: GoogleSheetsConfig): Promise<void> {
  const sheetIds = await ensureSheets(config);
  await googleRequest(config, ':batchUpdate', {
    method: 'POST',
    body: JSON.stringify({ requests: headerRequests(config, sheetIds) }),
  });
}

export async function appendBookingAndCustomer(
  config: GoogleSheetsConfig,
  booking: BookingRow,
): Promise<void> {
  const sheetIds = await ensureSheets(config);
  const bookingsSheetId = sheetIds.get(config.bookingsSheetName)!;
  const customersSheetId = sheetIds.get(config.customersSheetName)!;
  const bookingValues = [
    booking.submittedAt,
    booking.name,
    booking.phone,
    booking.department,
    booking.service,
    booking.page,
    booking.language,
  ];
  const customerValues = [booking.submittedAt, booking.name, booking.phone];

  await googleRequest(config, ':batchUpdate', {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        ...headerRequests(config, sheetIds),
        { appendCells: { sheetId: bookingsSheetId, rows: [row(bookingValues)], fields: 'userEnteredValue' } },
        { appendCells: { sheetId: customersSheetId, rows: [row(customerValues)], fields: 'userEnteredValue' } },
      ],
    }),
  });
}
