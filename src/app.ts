import { Command } from 'commander';
import { chromium } from 'playwright-chromium';
import { firefox } from 'playwright-firefox';
import { globalDataCheck } from './globaldata';
import { novoAtalhoCheck } from './novo-atalho';
import { check } from './pcdiga'
import { readFile } from './reader';

(async () => {

  console.log('Initializing Commander');

  const program = new Command();

  program
    .version('0.0.1')
    .requiredOption('-f, --filePath <path>', 'Path for the products links')
    .option('-d, --debug', 'Output extra debugging')
    .option('-b, --break <break>', 'Break time between each checking round in seconds', '30')
    .option('-i, --interval <interval>', 'Interval time between each product in seconds', '2');

  program.parse(process.argv);

  const options = program.opts();

  console.log('Initializing Browser');
  // const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Reading product urls from the file');
  const products = await readFile(options.filePath);

  while (true) {
    await check(products, page, options);
    await globalDataCheck(products, page, options);
    await novoAtalhoCheck(products, page, options);

    console.log('Taking a break for ' + options.break + 'seconds');
    await page.waitForTimeout(options.break * 1000);
  }

})();


