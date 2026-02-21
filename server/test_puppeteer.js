const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set real user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log("1. Opening login page...");
  await page.goto('https://www.saudibusiness.gov.sa/Identity/Account/Login', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log("   URL:", page.url());
  console.log("   Title:", await page.title());
  
  // Check if login page loaded
  const hasNafathButton = await page.$('button[value="Nafath"], input[value="Nafath"], .btn-nafath, [onclick*="Nafath"]');
  console.log("   Nafath button found:", !!hasNafathButton);
  
  // Try to find the external login form
  const forms = await page.$$eval('form', forms => forms.map(f => ({ action: f.action, method: f.method, id: f.id })));
  console.log("   Forms:", JSON.stringify(forms));
  
  // Try clicking nafath button
  console.log("\n2. Trying to click Nafath button...");
  try {
    // Find the nafath submit button
    const nafathBtn = await page.$('button[value="Nafath"]') || await page.$('input[name="provider"][value="Nafath"]');
    if (nafathBtn) {
      console.log("   Found nafath button, clicking...");
    }
    
    // Submit the external login form
    const response = await page.evaluate(() => {
      const form = document.querySelector('form[action*="ExternalLogin"]');
      if (form) {
        return { action: form.action, method: form.method };
      }
      return null;
    });
    console.log("   ExternalLogin form:", JSON.stringify(response));
    
    if (response) {
      // Click the nafath button to submit the form
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log("   Nav timeout:", e.message)),
        page.click('button[value="Nafath"]').catch(async () => {
          // Try submitting the form directly
          await page.evaluate(() => {
            const form = document.querySelector('form[action*="ExternalLogin"]');
            if (form) form.submit();
          });
        })
      ]);
      
      console.log("   After click URL:", page.url());
      console.log("   After click Title:", await page.title());
      
      // Check if we got "Request Rejected" or actual nafath page
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
      console.log("   Body preview:", bodyText.substring(0, 300));
    }
  } catch (e) {
    console.log("   Error:", e.message);
  }
  
  await browser.close();
  console.log("\nDone!");
})();
