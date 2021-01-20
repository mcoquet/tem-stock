import { OptionValues } from 'commander';
import { Page } from 'playwright-chromium';
import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from './logger';

export async function check(products: string[], page: Page, options: OptionValues): Promise<void> {

  for (const product of products) {

    const name = product.replace('https://www.pcdiga.com/', '').replace(/-/g, ' ');
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