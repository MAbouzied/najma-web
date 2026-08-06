import type { APIRoute } from 'astro';
import {
  GOOGLE_BOOKINGS_SHEET_NAME,
  GOOGLE_CUSTOMERS_SHEET_NAME,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SHEET_ID,
} from 'astro:env/server';
import { offers, packages, services } from '../../data/home';
import { appendBookingAndCustomer, isGoogleSheetsConfigured } from '../../lib/google-sheets';

export const prerender = false;

const departments = {
  general: 'عام',
  service: 'الخدمات',
  package: 'الباقات',
  offer: 'العروض',
} as const;

type Department = keyof typeof departments;

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function normalizePhone(value: string): string | undefined {
  const latinDigits = value
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
  const digits = latinDigits.replace(/\D/g, '');
  const local = digits.startsWith('00966')
    ? digits.slice(5)
    : digits.startsWith('966')
      ? digits.slice(3)
      : digits.startsWith('0')
        ? digits.slice(1)
        : digits;
  return /^5\d{8}$/.test(local) ? `+966${local}` : undefined;
}

function canonicalService(department: Department, value: string): string | undefined {
  if (department === 'general') return value ? undefined : 'حجز عام';
  const collection = department === 'service' ? services : department === 'package' ? packages : offers;
  const normalized = value.trim();
  const match = collection.find((item) => {
    const localized = 'title' in item ? item.title : item.name;
    return item.slug === normalized || localized.ar === normalized || localized.en === normalized;
  });
  if (!match) return undefined;
  return 'title' in match ? match.title.ar : match.name.ar;
}

export const POST = (async ({ request }) => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== requestUrl.origin) return json({ error: 'Invalid origin' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json({ error: 'JSON body required' }, 415);
  }
  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 10_000) return json({ error: 'Request too large' }, 413);
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (body.company) return json({ ok: true }, 200);
  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
  const phone = typeof body.phone === 'string' ? normalizePhone(body.phone) : undefined;
  const department = typeof body.department === 'string' && body.department in departments
    ? body.department as Department
    : undefined;
  const service = department && typeof body.service === 'string'
    ? canonicalService(department, body.service)
    : undefined;
  const language = body.language === 'en' ? 'en' : body.language === 'ar' ? 'ar' : undefined;
  const page = typeof body.page === 'string' && body.page.startsWith('/')
    ? body.page.slice(0, 200)
    : undefined;

  if (name.length < 2 || name.length > 80 || !phone || !department || !service || !language || !page) {
    return json({ error: 'Invalid booking details' }, 400);
  }
  const sheetsConfig = {
    serviceAccountEmail: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: GOOGLE_PRIVATE_KEY,
    spreadsheetId: GOOGLE_SHEET_ID,
    bookingsSheetName: GOOGLE_BOOKINGS_SHEET_NAME,
    customersSheetName: GOOGLE_CUSTOMERS_SHEET_NAME,
  };

  if (!isGoogleSheetsConfigured(sheetsConfig)) {
    console.warn('Google Sheets credentials are not configured; accepting booking without storage');
    return json({ ok: true, stored: false }, 200);
  }

  try {
    await appendBookingAndCustomer(
      sheetsConfig,
      {
        submittedAt: new Date().toISOString(),
        name,
        phone,
        department: departments[department],
        service,
        page,
        language,
      },
    );
    return json({ ok: true, stored: true }, 201);
  } catch (error) {
    console.error('Google Sheets booking write failed', error);
    return json({ error: 'Booking storage is unavailable' }, 502);
  }
}) satisfies APIRoute;
