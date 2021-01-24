import { getRaw } from '../../clients/telegram/http';
import { logProduct } from '../../logger';


// TODO: do not use playwright
// TODO: maybe the categorization of the product should be done before
export async function singleCheckPcComponentes(product: string): Promise<boolean> {

  if (!product.includes('https://www.pccomponentes.pt/')) {
    return false;
  }

  const name = product.replace('https://www.pccomponentes.pt/', 'PcComponentes > ').replace(/-/g, ' ');
  logProduct(name);

  try {
    const a = await getRaw(product);
    console.log(a);
  } catch (e) {
    console.log('eee', e);
  }


  return true;
  // const element = await page.$('#skrey_estimate_date_product_page_wrapper');
  // const text = await element?.innerText();

  // if (!text) {
  //   logProductNotFound();
  //   return false;
  // } else if (text.trim() === 'Sem stock') {
  //   logProductNoStock();
  //   return false;
  // } else {
  //   logProductInStock();
  //   return true;
  // }
}

singleCheckPcComponentes('https://www.pccomponentes.pt/evga-geforce-rtx-3060-ti-xc-8gb-gddr6');
