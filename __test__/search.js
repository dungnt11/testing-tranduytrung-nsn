const playwright = require('playwright');
const URL_TESTING = 'https://cellphones.com.vn/';

const input = [
  { name: 'Không nhập tìm kiếm', value: '' },
  { name: 'Nhập dấu cách', value: ' ' },
  { name: 'Nhập 1 kí tự lạ tìm kiếm', value: '#' },
  { name: 'Nhập nhiều chữ cái rời nhau', value: 'A í ã' },
  { name: 'Nhập đủ mã sản phẩm', value: 'A20K.013' },
];

(async () => {
  try {
    const browser = await playwright['firefox'].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(URL_TESTING);

    for (const inputItem of input) {
      const { name, value } = inputItem;
      console.log(`Find search by ${name}`);
      await page.evaluate(async (valueItem) => {
        const searchID = document.querySelector('#search');
        if (!searchID) throw new Error('Khong tim thay search !');
        searchID.value = valueItem;
      }, value);
  
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `__test__/searchScreenshot/${name}.png` });
      const productOfPage = await page.evaluate(() => {
        const productFindByValue = document.querySelectorAll('.phu-kien');
        if (!productFindByValue) return 'Not query product !';
        if (!productFindByValue[0]) return 'Not found product!';
        const result = productFindByValue[0].childElementCount;
        if (result > 0) {
          return `Find ${result} products`;
        } else {
          return 'Not found product!';
        }
      });
  
      console.log(productOfPage); 
    }

    await browser.close();
  } catch (error) {
    console.error(error);    
  }
})();