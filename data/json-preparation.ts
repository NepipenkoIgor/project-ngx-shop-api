import * as fs from 'fs';
import * as util from 'util';
import * as mongoose from 'mongoose';
import {
  IBaseCategory,
  // IBaseOrder,
  // IBaseOrderProduct,
  IBaseProduct,
  IBaseSubcategory,
  ICategory,
  IJsonData,
  // IOrder,
  // IOrderProduct,
  IProduct,
  ISubCategory,
} from './json-interfaces';

const fileName = 'original-data.json';
 // const fileName = 'db.json';

// eslint-disable-next-line @typescript-eslint/no-use-before-define
main();

async function main() {
  try {
    const asyncFileReader = util.promisify(fs.readFile);
    const asyncFileWriter = util.promisify(fs.writeFile);
    const buffer: Buffer = await asyncFileReader(`${__dirname}/${fileName}`);
    const json: IJsonData = JSON.parse(buffer.toString()) as IJsonData;
    let subCategories: ISubCategory[] = [];
    let products: IProduct[] = [];
    // let orders: IOrder[] = [];
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
                  // id: prodId,
                }: IBaseProduct): IProduct => {
                  const _productdId: mongoose.Types.ObjectId = mongoose.Types.ObjectId();
                  // const orders1 = json.orders.map(
                  //   ({
                  //     products: orderProducts,
                  //     totalCost,
                  //     createdAt,
                  //     delivery,
                  //     user,
                  //     phone,
                  //   }: IBaseOrder): IOrder => {
                  //     const _orderId: mongoose.Types.ObjectId = mongoose.Types.ObjectId();
                  //     const orderProducts1 = orderProducts
                  //       .filter(({ product }: IBaseOrderProduct): boolean => {
                  //         return prodId === product;
                  //       })
                  //       .map(
                  //         ({ count }: IBaseOrderProduct): IOrderProduct => {
                  //           return {
                  //             count,
                  //             product: _productdId,
                  //           };
                  //         }
                  //       );
                  //     return {
                  //       _id: _orderId,
                  //       createdAt,
                  //       delivery,
                  //       phone,
                  //       products: orderProducts1,
                  //       totalCost,
                  //       user,
                  //     };
                  //   }
                  // );
                  // orders = [...orders, ...orders1];
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
    // await asyncFileWriter(
    //   `${__dirname}/output/json-orders.json`,
    //   JSON.stringify(orders, null, 4),
    //   'utf8'
    // );
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
    // tslint:disable-next-line:no-console
    console.log(err);
  }
}
