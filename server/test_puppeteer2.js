const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log("1. Opening login page...");
  await page.goto('https://www.saudibusiness.gov.sa/Identity/Account/Login', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log("   URL:", page.url());
  
  // Find the ExternalLogin form and add provider hidden input, then submit
  console.log("\n2. Submitting ExternalLogin form with Nafath provider...");
  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.evaluate(() => {
        const form = document.querySelector('form#external-account');
        if (!form) throw new Error('Form not found');
        // Add provider input
        const providerInput = document.createElement('input');
        providerInput.type = 'hidden';
        providerInput.name = 'provider';
        providerInput.value = 'Nafath';
        form.appendChild(providerInput);
        // Submit
        form.submit();
      })
    ]);
    
    console.log("   After submit URL:", page.url());
    console.log("   After submit Title:", await page.title());
    
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    
    // Check for "Request Rejected"
    if (bodyText.includes('Request Rejected')) {
      console.log("   ❌ WAF BLOCKED - Request Rejected");
    } else if (bodyText.includes('Operation failed')) {
      console.log("   ⚠️ Nafath page loaded but operation failed");
    } else if (page.url().includes('iam.gov.sa')) {
      console.log("   ✅ REACHED IAM.GOV.SA - WAF BYPASSED!");
    } else {
      console.log("   Page loaded, checking content...");
    }
    
    console.log("   Body preview:", bodyText.substring(0, 400));
    
    // If we reached iam.gov.sa, check for nafath login form
    if (page.url().includes('iam.gov.sa')) {
      const hasIdInput = await page.$('input[name="nat_id"], input[name="nationalId"], input#nat_id, input[type="text"]');
      console.log("   Has ID input:", !!hasIdInput);
    }
    
  } catch (e) {
    console.log("   Error:", e.message);
  }
  
  await browser.close();
  console.log("\nDone!");
})();
