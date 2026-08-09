async (page) => {
  const BASE = 'http://127.0.0.1:4323';
  const EXPECTED_PHONE = '966579777407';

  function joinUrl(base, path) {
    if (!path) return base;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('tel:') || path.startsWith('mailto:')) return path;
    if (path.startsWith('//')) return 'https:' + path;
    const root = base.replace(/\/$/, '');
    if (path.startsWith('/')) return root + path;
    return root + '/' + path;
  }

  function stripHash(href) {
    const i = href.indexOf('#');
    return i === -1 ? href : href.slice(0, i);
  }

  function getSearchParam(href, key) {
    const qIndex = href.indexOf('?');
    if (qIndex === -1) return '';
    const query = href.slice(qIndex + 1).split('#')[0];
    const parts = query.split('&');
    for (const part of parts) {
      const eq = part.indexOf('=');
      const k = eq === -1 ? part : part.slice(0, eq);
      const v = eq === -1 ? '' : part.slice(eq + 1);
      if (decodeURIComponent(k) === key) {
        try {
          return decodeURIComponent(v.replace(/\+/g, ' '));
        } catch {
          return v;
        }
      }
    }
    return '';
  }

  function classify(href) {
    if (!href) return 'skip';
    if (href.startsWith('tel:')) return 'tel';
    if (href.includes('api.whatsapp.com') || href.includes('wa.me/')) return 'whatsapp';
    if (
      href.includes('instagram.com') ||
      href.includes('snapchat.com') ||
      href.includes('facebook.com') ||
      href.includes('tiktok.com') ||
      href.includes('twitter.com') ||
      href.includes('x.com') ||
      href.includes('youtube.com')
    ) {
      return 'social';
    }
    if (
      href.includes('google.com/maps') ||
      href.includes('maps.google') ||
      href.includes('maps.app.goo.gl')
    ) {
      return 'maps';
    }
    if (href.startsWith(BASE) || href.startsWith('/')) return 'internal';
    if (href.startsWith('http')) return 'external';
    return 'other';
  }

  async function checkHttp(url) {
    try {
      const resp = await page.request.get(url, { maxRedirects: 10, timeout: 25000 });
      return { status: resp.status(), ok: resp.status() >= 200 && resp.status() < 400, error: null };
    } catch (e) {
      return { status: 0, ok: false, error: String(e.message || e).slice(0, 160) };
    }
  }

  const pageResults = [];
  const linkResults = [];
  const whatsappFlowResults = [];
  const seenPages = new Set();
  const seenLinks = new Set();

  const serviceSlugs = [
    'swedish-massage',
    'thai-massage',
    'hot-stone-massage',
    'cupping',
    'massage-relaxation',
    'shiatsu',
    'hot-oil-massage',
    'star-spa-massage',
    'moroccan-bath',
    'royal-bath',
    'steam-session',
    'manicure-pedicure',
    'body-scrub',
  ];
  const packageSlugs = ['groom', 'luxury', 'gift'];
  const offerSlugs = [
    'recovery',
    'relaxation',
    'signature',
    'care',
    'elegance',
    'prosperity',
    'royal',
    'golden',
  ];

  const seedPages = [
    '/',
    '/about/',
    '/services/',
    '/offers/',
    '/packages/',
    '/blogs/',
    '/contact/',
    '/go/',
    '/book/',
    '/login/',
    '/en/',
    '/en/about/',
    '/en/services/',
    '/en/offers/',
    '/en/packages/',
    '/en/contact/',
    '/en/go/',
    '/en/book/',
    '/llms.txt',
    '/robots.txt',
  ];

  for (const slug of serviceSlugs) {
    seedPages.push(`/services/${slug}/`, `/en/services/${slug}/`);
  }
  for (const slug of packageSlugs) {
    seedPages.push(`/packages/${slug}/`, `/en/packages/${slug}/`);
  }
  for (const slug of offerSlugs) {
    seedPages.push(`/offers/${slug}/`, `/en/offers/${slug}/`);
  }

  // Phase 1: HTTP check all known pages
  for (const path of seedPages) {
    const full = joinUrl(BASE, path);
    if (seenPages.has(full)) continue;
    seenPages.add(full);
    const check = await checkHttp(full);
    pageResults.push({
      type: 'internal-page',
      link: path,
      status: check.status || check.error || 0,
      pass: check.ok,
      note: check.ok ? 'OK' : check.error || `HTTP ${check.status}`,
    });
  }

  // Phase 2: crawl key pages for anchors
  const crawlPages = [
    '/',
    '/en/',
    '/services/',
    '/en/services/',
    '/offers/',
    '/en/offers/',
    '/packages/',
    '/en/packages/',
    '/contact/',
    '/en/contact/',
    '/go/',
    '/en/go/',
    '/book/',
    '/en/book/',
    '/about/',
    '/en/about/',
    '/blogs/',
    `/services/${serviceSlugs[0]}/`,
    `/en/services/${serviceSlugs[0]}/`,
    `/packages/${packageSlugs[0]}/`,
    `/en/packages/${packageSlugs[0]}/`,
    `/offers/${offerSlugs[0]}/`,
    `/en/offers/${offerSlugs[0]}/`,
  ];

  const collected = [];

  for (const path of crawlPages) {
    const full = joinUrl(BASE, path);
    try {
      await page.goto(full, { waitUntil: 'domcontentloaded', timeout: 45000 });
      const anchors = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]')).map((a) => ({
          href: a.href,
          text: (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
        })),
      );
      for (const a of anchors) {
        const abs = stripHash(a.href);
        const type = classify(abs.startsWith('http') || abs.startsWith('tel:') ? abs : joinUrl(BASE, abs));
        const normalized = abs.startsWith('http') || abs.startsWith('tel:') ? abs : joinUrl(BASE, abs);
        if (type === 'skip') continue;
        const key = type + '|' + normalized;
        if (seenLinks.has(key)) continue;
        seenLinks.add(key);
        collected.push({ href: normalized, text: a.text, type, source: path });
      }
    } catch (e) {
      linkResults.push({
        type: 'crawl-error',
        link: path,
        status: 'error',
        pass: false,
        note: String(e.message || e).slice(0, 160),
      });
    }
  }

  // Phase 3: validate collected links
  for (const item of collected) {
    const { href, text, type, source } = item;

    if (type === 'tel') {
      const pass = href === 'tel:+' + EXPECTED_PHONE || href === 'tel:' + EXPECTED_PHONE;
      linkResults.push({
        type: 'tel',
        link: href,
        label: text,
        source,
        status: pass ? 'valid' : 'invalid',
        pass,
        note: pass ? 'correct phone' : 'expected tel:+' + EXPECTED_PHONE,
      });
      continue;
    }

    if (type === 'whatsapp') {
      let phone = getSearchParam(href, 'phone');
      if (!phone && href.includes('wa.me/')) {
        phone = href.split('wa.me/')[1].split(/[?#]/)[0];
      }
      const message = getSearchParam(href, 'text');
      const phoneOk = phone === EXPECTED_PHONE;
      const msgOk = message.length > 0;
      linkResults.push({
        type: 'whatsapp-direct',
        link: href,
        label: text,
        source,
        status: phoneOk ? 'valid-url' : 'bad-phone',
        pass: phoneOk && msgOk,
        note: phoneOk
          ? 'phone OK; message="' + message.slice(0, 140) + '"'
          : 'phone=' + (phone || 'missing') + ' expected ' + EXPECTED_PHONE,
        message,
      });
      continue;
    }

    if (type === 'social' || type === 'maps') {
      const check = await checkHttp(href);
      const knownBrand =
        href === 'https://www.instagram.com/nagmspa/' ||
        href === 'https://www.snapchat.com/add/nagmspa' ||
        href.includes('google.com/maps') ||
        href.includes('maps.app.goo.gl');
      const pass = check.ok || knownBrand;
      linkResults.push({
        type,
        link: href,
        label: text,
        source,
        status: check.status || check.error || 0,
        pass,
        note: check.ok
          ? 'reachable'
          : knownBrand
            ? 'request blocked/failed but brand URL OK (' + (check.error || check.status) + ')'
            : check.error || 'HTTP ' + check.status,
      });
      continue;
    }

    if (type === 'internal') {
      const path = href.indexOf(BASE) === 0 ? href.slice(BASE.length) || '/' : href;
      if (
        path.startsWith('/assets/') ||
        path.startsWith('/api/') ||
        path.startsWith('/admin') ||
        path.startsWith('/_') ||
        path.startsWith('/node_modules')
      ) {
        continue;
      }
      const check = await checkHttp(href);
      linkResults.push({
        type: 'internal-link',
        link: path,
        label: text,
        source,
        status: check.status || check.error || 0,
        pass: check.ok,
        note: check.ok ? 'OK' : check.error || 'HTTP ' + check.status,
      });
      continue;
    }

    if (type === 'external') {
      const check = await checkHttp(href);
      linkResults.push({
        type: 'external',
        link: href,
        label: text,
        source,
        status: check.status || check.error || 0,
        pass: check.ok,
        note: check.ok ? 'OK' : check.error || 'HTTP ' + check.status,
      });
    }
  }

  // Phase 4: card WhatsApp / booking CTAs
  const listingChecks = [
    { path: '/services/', selector: '[data-service-card] a[data-gtm-event="contact_whatsapp"], [data-service-card] a[href*="book"]' },
    { path: '/packages/', selector: '[data-package-card] a[data-gtm-event="contact_whatsapp"], [data-package-card] a[href*="book"]' },
    { path: '/offers/', selector: '[data-offer-card] a[data-gtm-event="contact_whatsapp"], [data-offer-card] a[href*="book"]' },
    { path: '/en/services/', selector: '[data-service-card] a[data-gtm-event="contact_whatsapp"], [data-service-card] a[href*="book"]' },
    { path: '/en/packages/', selector: '[data-package-card] a[data-gtm-event="contact_whatsapp"], [data-package-card] a[href*="book"]' },
    { path: '/en/offers/', selector: '[data-offer-card] a[data-gtm-event="contact_whatsapp"], [data-offer-card] a[href*="book"]' },
  ];

  for (const lc of listingChecks) {
    try {
      await page.goto(joinUrl(BASE, lc.path), { waitUntil: 'domcontentloaded', timeout: 45000 });
      const ctas = await page.$$eval(lc.selector, (els) =>
        els.map((el) => ({
          href: el.href || el.getAttribute('href'),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        })),
      );
      for (const cta of ctas) {
        const abs = stripHash(cta.href.startsWith('http') ? cta.href : joinUrl(BASE, cta.href));
        const type = classify(abs);
        if (type === 'whatsapp') {
          const phone = getSearchParam(abs, 'phone');
          const message = getSearchParam(abs, 'text');
          whatsappFlowResults.push({
            type: 'card-whatsapp-direct',
            link: abs,
            source: lc.path,
            label: cta.text,
            status: phone === EXPECTED_PHONE ? 'valid' : 'bad-phone',
            pass: phone === EXPECTED_PHONE && message.length > 0,
            note: 'message="' + message.slice(0, 140) + '"',
            message,
          });
        } else if (abs.includes('/book')) {
          const hasDept = abs.includes('department=');
          const hasItem = abs.includes('item=');
          whatsappFlowResults.push({
            type: 'card-booking-cta',
            link: abs.replace(BASE, ''),
            source: lc.path,
            label: cta.text,
            status: 'collected',
            pass: hasDept && hasItem,
            note: hasDept && hasItem ? 'deep-link includes department+item' : 'missing department/item query',
          });
        }
      }
    } catch (e) {
      whatsappFlowResults.push({
        type: 'card-scan-error',
        link: lc.path,
        status: 'error',
        pass: false,
        note: String(e.message || e).slice(0, 160),
      });
    }
  }

  // Phase 5: booking form -> WhatsApp message content
  const bookingSamples = [
    {
      locale: 'ar',
      department: 'service',
      item: 'مساج الاسترخاء',
      path: '/book/?department=service&item=%D9%85%D8%B3%D8%A7%D8%AC%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B1%D8%AE%D8%A7%D8%A1',
    },
    {
      locale: 'ar',
      department: 'package',
      item: 'باقة العرسان',
      path: '/book/?department=package&item=%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%B9%D8%B1%D8%B3%D8%A7%D9%86',
    },
    {
      locale: 'ar',
      department: 'offer',
      item: 'عرض التعافي',
      path: '/book/?department=offer&item=%D8%B9%D8%B1%D8%B6%20%D8%A7%D9%84%D8%AA%D8%B9%D8%A7%D9%81%D9%8A',
    },
    {
      locale: 'en',
      department: 'service',
      item: 'Relaxation Massage',
      path: '/en/book/?department=service&item=Relaxation%20Massage',
    },
    {
      locale: 'en',
      department: 'package',
      item: 'Wedding Package',
      path: '/en/book/?department=package&item=Wedding%20Package',
    },
    {
      locale: 'en',
      department: 'offer',
      item: 'Recovery Offer',
      path: '/en/book/?department=offer&item=Recovery%20Offer',
    },
  ];

  for (const sample of bookingSamples) {
    const full = joinUrl(BASE, sample.path);
    try {
      await page.goto(full, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector('#booking-form', { timeout: 15000 });

      const selected = await page.evaluate(() => {
        const select = document.querySelector('#booking-form select[name="booking"]');
        if (!(select instanceof HTMLSelectElement)) return null;
        const opt = select.selectedOptions[0];
        return {
          value: select.value,
          label: (opt?.textContent || '').trim(),
          ar: opt?.dataset.ar || '',
          en: opt?.dataset.en || '',
        };
      });

      const preselectPass =
        !!selected &&
        selected.value.startsWith(sample.department + ':') &&
        (selected.ar === sample.item || selected.en === sample.item || selected.label === sample.item);

      await page.fill('#booking-form input[name="name"]', 'Link Audit Test');
      await page.fill('#booking-form input[name="phone"]', '0551234567');

      await page.evaluate(() => {
        window.__waCapture = null;
        const origOpen = window.open;
        window.open = function (url, ...rest) {
          if (typeof url === 'string' && (url.includes('whatsapp') || url.includes('wa.me') || url === 'about:blank')) {
            const win = {
              opener: null,
              set location(v) {
                window.__waCapture = typeof v === 'string' ? v : v && v.href;
              },
              get location() {
                return { href: window.__waCapture || 'about:blank' };
              },
            };
            if (url !== 'about:blank') window.__waCapture = url;
            return win;
          }
          return origOpen.call(window, url, ...rest);
        };
      });

      await page.route('**/api/customers**', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
      });

      await page.click('#booking-form button[type="submit"]');
      await page.waitForTimeout(1800);

      const whatsappUrl = await page.evaluate(() => window.__waCapture);
      try {
        await page.unroute('**/api/customers**');
      } catch {}

      let phone = '';
      let message = '';
      if (whatsappUrl) {
        phone = getSearchParam(whatsappUrl, 'phone');
        message = getSearchParam(whatsappUrl, 'text');
      }

      const phoneOk = phone === EXPECTED_PHONE;
      const itemInMessage = message.includes(sample.item) || message.includes(selected?.label || '___');
      const nameInMessage = message.includes('Link Audit Test');
      const phoneInMessage = message.includes('0551234567');

      whatsappFlowResults.push({
        type: 'booking-form-whatsapp',
        link: sample.path,
        locale: sample.locale,
        department: sample.department,
        expectedItem: sample.item,
        selected,
        whatsappUrl,
        message,
        status: whatsappUrl ? 'opened' : 'no-url',
        pass: !!(preselectPass && phoneOk && itemInMessage && nameInMessage && phoneInMessage),
        note: [
          preselectPass ? 'preselect OK' : 'preselect FAIL (got ' + (selected?.label || 'none') + ')',
          phoneOk ? 'WA phone OK' : 'WA phone FAIL (' + phone + ')',
          itemInMessage ? 'item in message' : 'item MISSING in message',
          nameInMessage ? 'name in message' : 'name MISSING',
          phoneInMessage ? 'customer phone in message' : 'customer phone MISSING',
        ].join('; '),
      });
    } catch (e) {
      whatsappFlowResults.push({
        type: 'booking-form-whatsapp',
        link: sample.path,
        expectedItem: sample.item,
        status: 'error',
        pass: false,
        note: String(e.message || e).slice(0, 200),
      });
    }
  }

  // Phase 6: general WhatsApp on go/contact
  for (const path of ['/go/', '/en/go/', '/contact/', '/en/contact/']) {
    try {
      await page.goto(joinUrl(BASE, path), { waitUntil: 'domcontentloaded', timeout: 45000 });
      const wa = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]')).map((a) => a.href),
      );
      const unique = [];
      for (const href of wa) {
        if (!unique.includes(href)) unique.push(href);
      }
      for (const href of unique) {
        const phone = getSearchParam(href, 'phone');
        const message = getSearchParam(href, 'text');
        const phoneOk = phone === EXPECTED_PHONE;
        whatsappFlowResults.push({
          type: 'page-whatsapp-direct',
          link: href,
          source: path,
          message,
          status: phoneOk ? 'valid' : 'bad-phone',
          pass: phoneOk && message.length > 0,
          note: phoneOk ? 'message="' + message.slice(0, 120) + '"' : 'phone=' + phone,
        });
      }
    } catch (e) {
      whatsappFlowResults.push({
        type: 'page-whatsapp-direct',
        link: path,
        status: 'error',
        pass: false,
        note: String(e.message || e).slice(0, 160),
      });
    }
  }

  const summary = {
    pages: {
      total: pageResults.length,
      passed: pageResults.filter((r) => r.pass).length,
      failed: pageResults.filter((r) => !r.pass).length,
    },
    links: {
      total: linkResults.length,
      passed: linkResults.filter((r) => r.pass).length,
      failed: linkResults.filter((r) => !r.pass).length,
    },
    whatsappFlows: {
      total: whatsappFlowResults.length,
      passed: whatsappFlowResults.filter((r) => r.pass).length,
      failed: whatsappFlowResults.filter((r) => !r.pass).length,
    },
  };

  return {
    base: BASE,
    summary,
    pageResults,
    linkResults,
    whatsappFlowResults,
  };
}
