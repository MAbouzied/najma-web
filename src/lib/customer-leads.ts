export interface CustomerLead {
  name: string;
  phone: string;
  department: 'general' | 'service' | 'package' | 'offer';
  service: string;
  page: string;
  language: 'ar' | 'en';
  company?: string;
}

export async function submitCustomerLead(lead: CustomerLead): Promise<boolean> {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
