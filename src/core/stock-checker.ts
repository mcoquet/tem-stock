import { chromium, Page } from "playwright-chromium";
import { getBooleanConfig, getNumberConfig } from "../clients/telegram/configuration";
import { singleCheckGlobalData } from "./shops/globaldata";
import { singleCheckNovoAtalho } from "./shops/novo-atalho";
import { singleCheckPcdiga } from "./shops/pcdiga";


export async function setStockCheckInterval(getProducts: () => Promise<string[]>, callback: (product: string, inStock: boolean) => Promise<void>): Promise<void> {

  setInterval(async () => {

    console.log("Checking stock for all products");

    const browser = await chromium.launch(await getBooleanConfig('debug') ? { headless: false, slowMo: 100 } : {});
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const product of await getProducts()) {
      const inStock = await checkProduct(product, page);
      await callback(product, inStock);
    }

    browser.close();

  }, await getNumberConfig('stockCheckInterval') * 1000);
}

// TODO: Find better way to do this
export async function checkProduct(productUrl: string, page: Page): Promise<boolean> {
  let result = false;
  result = result || await singleCheckPcdiga(productUrl, page);
  result = result || await singleCheckGlobalData(productUrl, page);
  result = result || await singleCheckNovoAtalho(productUrl, page);
  return result;
}
