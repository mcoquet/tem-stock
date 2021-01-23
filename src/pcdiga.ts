import { OptionValues } from 'commander';
import { Page } from 'playwright-core';
import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from './logger';

export async function check(products: string[], page: Page, options: OptionValues): Promise<void> {

  for (const product of products) {

    if (!product.includes('https://www.pcdiga.com/')) {
      continue;
    }
    const name = product.replace('https://www.pcdiga.com/', 'PCDIGA > ').replace(/-/g, ' ');
    logProduct(name);

    await page.goto(product);
    const element = await page.$('#skrey_estimate_date_product_page_wrapper');
    const text = await element?.innerText();

    if (!text) {
      logProductNotFound();
    } else if (text.trim() === 'Sem stock') {
      logProductNoStock();
    } else {
      logProductInStock();
    }

    await page.waitForTimeout(options.interval * 1000);
  }

}