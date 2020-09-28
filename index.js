const playwright = require('playwright');
const URL_TESTING = 'https://cellphones.com.vn/';

(async () => {
  const listBrowser = ['chromium', 'firefox', 'webkit'];
  console.log('Testing in browser');
  await Promise.all(listBrowser.map(async (browserType) => {
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    const responsive = await page.goto(URL_TESTING);
    const { status } = responsive._initializer;
    if (status === 200) {
      console.log(`Passed in ${browserType}`);
    } else {
      console.error(`Error in ${browserType} | Status code: ${status}`);
    }
    await browser.close();
  }));

  console.log('Testing redirect link with firefox');
  const browser = await playwright['firefox'].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(URL_TESTING);
  const dimensions = await page.evaluate(async () => {
    const products = document.querySelectorAll('.lt-product-group-info');
    if (!products.length) return 'Not found product !';
    // Select first element and goto link
    const firstProduct = products[0].querySelector('a');
    if (!firstProduct) return 'Not found a element !';
    console.log(`First product ${firstProduct.innerHTML}`);
    const linkFirstProduct = firstProduct.getAttribute('href');
    return linkFirstProduct;
  });

  const responsive = await page.goto(dimensions);
  const { status } = responsive._initializer;
  if (status === 200) {
    console.log('Passed !!');
  } else {
    console.error(`Error in ${dimensions} | Status code: ${status}`);
  }
  await browser.close();
})();