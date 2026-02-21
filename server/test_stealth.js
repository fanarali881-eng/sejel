const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  console.log("Starting Stealth Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  });
  
  console.log("1. Opening login page...");
  await page.goto('https://www.saudibusiness.gov.sa/Identity/Account/Login', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log("   URL:", page.url());
  console.log("   Title:", await page.title());
  
  // Wait a bit to seem more human
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("\n2. Submitting ExternalLogin form...");
  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.evaluate(() => {
        const form = document.querySelector('form#external-account');
        if (!form) throw new Error('Form not found');
        const providerInput = document.createElement('input');
        providerInput.type = 'hidden';
        providerInput.name = 'provider';
        providerInput.value = 'Nafath';
        form.appendChild(providerInput);
        form.submit();
      })
    ]);
    
    const url = page.url();
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    
    console.log("   URL:", url);
    console.log("   Title:", title);
    
    if (bodyText.includes('Request Rejected')) {
      console.log("   ❌ STILL BLOCKED by WAF");
    } else if (url.includes('iam.gov.sa')) {
      console.log("   ✅ SUCCESS! Reached iam.gov.sa!");
    } else {
      console.log("   Result:", bodyText.substring(0, 300));
    }
    
  } catch (e) {
    console.log("   Error:", e.message);
  }
  
  await browser.close();
  console.log("\nDone!");
})();
