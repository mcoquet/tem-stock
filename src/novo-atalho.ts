import { OptionValues } from 'commander';
import { Page } from 'playwright-chromium';
import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from './logger';

export async function novoAtalhoCheck(products: string[], page: Page, options: OptionValues): Promise<void> {

  for (const product of products) {

    if (!product.includes('https://www.novoatalho.pt/')) {
      continue;
    }
    const name = 'Novo Atalho > ' + product.split('/')[6].replace(/-/g, ' ');
    logProduct(name);

    await page.goto(product);
    const element = await page.$('.stock>b>a');
    const text = await element?.innerText();

    if (!text) {
      logProductNotFound();
    } else if (text.trim() === 'INDISPONÍVEL') {
      logProductNoStock();
    } else {
      logProductInStock();
    }

    await page.waitForTimeout(options.interval * 1000);
  }

}