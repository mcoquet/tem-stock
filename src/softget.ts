import { readFile } from './clients/cli/reader';
const hget = require('hget');
const got = require('got');

const get = async () => {
    const products = await readFile('produtos.txt');
    got(products[0]).text().then((results:string) => {
        return hget(results, {root:'#skrey_estimate_date_product_page_wrapper'});
    })
    

}

export default get
