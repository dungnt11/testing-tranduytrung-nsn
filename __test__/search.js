const playwright = require('playwright');
const URL_TESTING = 'https://cellphones.com.vn/';

const input = [
  { name: 'Không nhập tìm kiếm', value: '' },
  { name: 'Nhập dấu cách', value: ' ' },
  { name: 'Nhập 1 kí tự lạ tìm kiếm', value: '#' },
  { name: 'Nhập 1 chữ cái tìm kiếm', value: 'a' },
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
      const productOfPage = await page.evaluate((valueItem) => {
        const productFindByValue = document.querySelectorAll('.products-container')[0];
        if (window.location.pathname === '/') return 'Không tìm kiếm';
        if (!productFindByValue) return 'Tìm kiếm không ra kết quả';
        const titleQuery = Array.from(productFindByValue.querySelectorAll('.lt-product-group-info h3')).map((item) => item.innerHTML);
        return titleQuery.every((item) => item.includes(valueItem) || item.includes(valueItem.toUpperCase())) ? `Tìm thấy sản phầm có chữ ${valueItem}` : 'Tìm kiếm không ra kết quả';;
      }, value)
      console.log(productOfPage);
    }

    await browser.close();
  } catch (error) {
    console.error(error);    
  }
})();