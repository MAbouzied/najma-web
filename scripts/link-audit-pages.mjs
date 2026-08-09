async (page) => {
  const BASE = 'http://127.0.0.1:4323';
  function joinUrl(base, path) {
    if (path.startsWith('http')) return path;
    return base.replace(/\/$/, '') + path;
  }
  async function checkHttp(url) {
    try {
      const resp = await page.request.get(url, { maxRedirects: 10, timeout: 25000 });
      return { status: resp.status(), ok: resp.status() >= 200 && resp.status() < 400, error: null };
    } catch (e) {
      return { status: 0, ok: false, error: String(e.message || e).slice(0, 160) };
    }
  }

  const serviceSlugs = ['swedish-massage','thai-massage','hot-stone-massage','cupping','massage-relaxation','shiatsu','hot-oil-massage','star-spa-massage','moroccan-bath','royal-bath','steam-session','manicure-pedicure','body-scrub'];
  const packageSlugs = ['groom','luxury','gift'];
  const offerSlugs = ['recovery','relaxation','signature','care','elegance','prosperity','royal','golden'];
  const seedPages = ['/','/about/','/services/','/offers/','/packages/','/blogs/','/contact/','/go/','/book/','/login/','/en/','/en/about/','/en/services/','/en/offers/','/en/packages/','/en/contact/','/en/go/','/en/book/','/llms.txt','/robots.txt'];
  for (const slug of serviceSlugs) seedPages.push(`/services/${slug}/`, `/en/services/${slug}/`);
  for (const slug of packageSlugs) seedPages.push(`/packages/${slug}/`, `/en/packages/${slug}/`);
  for (const slug of offerSlugs) seedPages.push(`/offers/${slug}/`, `/en/offers/${slug}/`);

  const pageResults = [];
  for (const path of seedPages) {
    const check = await checkHttp(joinUrl(BASE, path));
    pageResults.push({
      type: 'internal-page',
      link: path,
      status: check.status || check.error || 0,
      pass: check.ok,
      note: check.ok ? 'OK' : (check.error || ('HTTP ' + check.status)),
    });
  }
  return {
    phase: 'pages',
    summary: { total: pageResults.length, passed: pageResults.filter(r => r.pass).length, failed: pageResults.filter(r => !r.pass).length },
    pageResults,
  };
}
