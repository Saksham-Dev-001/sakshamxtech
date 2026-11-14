// Dynamic ads.txt handler for Google AdSense
export default async function handler(req, res) {
  let adsTxt = 'google.com, pub-5987406991972289, DIRECT, f08c47fec0942fa0';

  try {
    const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/sakshamxtech-7fe06/databases/(default)/documents/appConfig/siteSettings';
    const response = await fetch(firestoreUrl, { headers: { 'Accept': 'application/json' } });
    if (response.ok) {
      const doc = await response.json();
      const customAdsTxt = doc?.fields?.adsConfig?.mapValue?.fields?.adsTxtContent?.stringValue;
      const adClient = doc?.fields?.adsConfig?.mapValue?.fields?.adClient?.stringValue;

      if (customAdsTxt && customAdsTxt.trim()) {
        adsTxt = customAdsTxt.trim();
      } else if (adClient && adClient.includes('pub-')) {
        const cleanPub = adClient.replace(/^ca-/, '');
        adsTxt = `google.com, ${cleanPub}, DIRECT, f08c47fec0942fa0`;
      }
    }
  } catch (err) {
    console.warn('[ads.txt] Error fetching custom ads.txt:', err);
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.status(200).send(adsTxt);
}
