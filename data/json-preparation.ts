import * as fs from 'fs';
import * as util from 'util';
import * as mongoose from 'mongoose';
import {
  IBaseCategory,
  IBaseProduct,
  IBaseSubcategory,
  ICategory,
  IJsonData,
  IProduct,
  ISubCategory,
} from './json-interfaces';

const fileName = 'original-data.json';

main();

async function main() {
  try {
    const asyncFileReader = util.promisify(fs.readFile);
    const asyncFileWriter = util.promisify(fs.writeFile);
    const buffer: Buffer = await asyncFileReader(`${__dirname}/${fileName}`);
    const json: IJsonData = JSON.parse(buffer.toString()) as IJsonData;
    let subCategories: ISubCategory[] = [];
    let products: IProduct[] = [];
    const categories: ICategory[] = json.categories.map(
      ({ title, id }: IBaseCategory): ICategory => {
        const categoryId: mongoose.Types.ObjectId = mongoose.Types.ObjectId();
        const subcategories = json.subcategories
          .filter(({ category }) => id === category)
          .map(({ title: subTitle, id: subId }: IBaseSubcategory) => {
            const _subId: mongoose.Types.ObjectId = mongoose.Types.ObjectId();
            const products1 = json.products
              .filter(({ subcategory }) => subcategory === subId)
              .map(
                ({
                  title: prodTitle,
                  price: prodPrice,
                  brand: prodBrand,
                  status: prodStatus,
                  description: prodDescription,
                  characteristics: prodCharacteristics,
                  images: prodImages,
                }: IBaseProduct): IProduct => {
                  const _productdId: mongoose.Types.ObjectId = mongoose.Types.ObjectId();
                  return {
                    _id: _productdId,
                    description: prodDescription,
                    brand: prodBrand,
                    characteristics: prodCharacteristics,
                    images: prodImages,
                    name: prodTitle,
                    price: prodPrice,
                    status: prodStatus,
                    subCategory: _subId,
                  };
                }
              );
            products = [...products, ...products1];
            return { name: subTitle, _id: _subId, category: categoryId };
          });
        subCategories = [...subCategories, ...subcategories];
        return { name: title, _id: categoryId };
      }
    );
    if (!fs.existsSync(`${__dirname}/output`)) {
      fs.mkdirSync(`${__dirname}/output`);
    }
    await asyncFileWriter(
      `${__dirname}/output/json-products.json`,
      JSON.stringify(products, null, 4),
      'utf8'
    );
    await asyncFileWriter(
      `${__dirname}/output/json-categories.json`,
      JSON.stringify(categories, null, 4),
      'utf8'
    );
    await asyncFileWriter(
      `${__dirname}/output/json-sub-categories.json`,
      JSON.stringify(subCategories, null, 4),
      'utf8'
    );
  } catch (err) {
    console.log(err);
  }
}
