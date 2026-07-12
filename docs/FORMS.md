# Forms - External Service Requirements

## WPForms: Simple Appointment Form (ID 6)

This form exists in the WordPress backup but is **not embedded** on any published Najma page. No visual form appears on the live site pages included in this rebuild.

### Fields (from backup)

| Field ID | Type | Label (Arabic) | Required |
|----------|------|----------------|----------|
| 0 | name (simple) | الاسم | Yes |
| 4 | phone (smart) | الهاتف | No |
| 5 | date-time | تاريخ الحجز | No |

### Settings

- Submit text: أرسل الطلب
- Processing text: جارٍ الإرسال...
- AJAX submit: enabled
- Notification email: `{admin_email}` (njemspa@gmail.com)
- Confirmation: message - "Thanks for contacting us! We will be in touch with you shortly."

### Frontend-only replacement options

To restore booking functionality, connect one of:

1. **Formspree / Getform / Basin** - POST form submissions to a hosted endpoint
2. **Custom API** - Next.js API route on a separate backend (not included in static export)
3. **WhatsApp fallback** - Current site uses WhatsApp (`0542030018`) as primary contact CTA

### Recommendation

The rebuilt site preserves WhatsApp and phone CTAs from the original pages. If appointment booking is needed later, implement a dedicated `/book/` page with the same field labels and wire it to an external form service.
