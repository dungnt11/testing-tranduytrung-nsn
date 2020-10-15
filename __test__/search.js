const playwright = require('playwright');
const fs = require('fs');
const URL_TESTING = 'https://cellphones.com.vn/';

const input = [
  { name: 'Không nhập tìm kiếm', value: '', result: 'Không tìm kiếm' },
  { name: 'Nhập dấu cách', value: ' ', result: 'Tìm kiếm không ra kết quả' },
  { name: 'Nhập 1 kí tự lạ tìm kiếm', value: '#', result: 'Tìm kiếm không ra kết quả' },
  { name: 'Nhập 1 chữ cái tìm kiếm', value: 'a', result: 'Tìm thấy sản phầm có chữ a' },
  { name: 'Nhập nhiều chữ cái rời nhau', value: 'A í ã', result: 'Tìm kiếm không ra kết quả' },
  { name: 'Nhập đủ mã sản phẩm', value: 'A20K.013', result: 'Tìm thấy sản phầm có mã A20K.013' },
];

(async () => {
  try {
    const browser = await playwright['firefox'].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(URL_TESTING);

    let contentFinal = '';

    for (const inputItem of input) {
      const { name, value, result } = inputItem;
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

      if (productOfPage === result) {
        const content = `Pass: ${productOfPage}`;
        console.log(content);
        contentFinal += `${content}\n`;
      } else {
        const content = `FAIL: ${productOfPage}`;
        console.log(content);
        contentFinal += `${content}\n`;
      };
    }
    fs.writeFileSync('./input.txt', contentFinal);
    await browser.close();
  } catch (error) {
    console.error(error);    
  }
})();