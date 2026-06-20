/* Parse un User-Agent string → { device, browser, os } */
function parseUA(ua = '') {
  const device =
    /iPad/i.test(ua)                           ? 'Tablette' :
    /Mobile|Android|iPhone|iPod/i.test(ua)     ? 'Mobile'   : 'Desktop';

  const browser =
    /Edg\//i.test(ua)                          ? 'Edge'     :
    /OPR|Opera/i.test(ua)                      ? 'Opera'    :
    /Firefox\//i.test(ua)                      ? 'Firefox'  :
    /Chrome\//i.test(ua)                       ? 'Chrome'   :
    /Safari\//i.test(ua)                       ? 'Safari'   : 'Autre';

  const os =
    /Windows NT/i.test(ua)                     ? 'Windows'  :
    /iPhone|iPad|iPod/i.test(ua)               ? 'iOS'      :
    /Mac OS X/i.test(ua)                       ? 'macOS'    :
    /Android/i.test(ua)                        ? 'Android'  :
    /Linux/i.test(ua)                          ? 'Linux'    : 'Autre';

  return { device, browser, os };
}

/* Extraire l'IP réelle même derrière un proxy (Railway, Vercel) */
function getIP(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.ip ||
    ''
  );
}

module.exports = { parseUA, getIP };
