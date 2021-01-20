import { OptionValues } from 'commander';
import { Page } from 'playwright-chromium';
import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from './logger';

export async function globalDataCheck(products: string[], page: Page, options: OptionValues): Promise<void> {

  for (const product of products) {

    if (!product.includes('https://www.globaldata.pt/')) {
      continue;
    }
    const name = product.replace('https://www.globaldata.pt/', 'Globaldata > ').replace(/-/g, ' ');
    logProduct(name);

    await page.goto(product);
    const element = await page.$('.stock-lifting>.stock-shops>span:first-child');
    const text = await element?.innerText();

    if (!text) {
      logProductNotFound();
    } else if (text.trim() === 'ESGOTADO') {
      logProductNoStock();
    } else {
      logProductInStock();
    }

    await page.waitForTimeout(options.interval * 1000);
  }

}