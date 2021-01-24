import chalk from "chalk";

export function logProduct(product: string) {
  process.stdout.write(product + ' ');
}

export function logProductNoStock() {
  console.log(chalk.inverse(' No Stock '));
}

export function logProductNotFound() {
  console.log(chalk.bold.white.bgRed(' Not Found '));
}

export function logProductInStock() {
  console.log(chalk.bold.black.bgGreen(' .:. In Stock .:. '));
}
