import { IProduct } from './interfaces/product.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class ProductsService {
  public constructor(
    // tslint:disable-next-line: no-any
    @InjectModel('Products') private readonly productModel: Model<any>
  ) {}
  public async findProdcuts(
    subCat: string | undefined,
    text: string | undefined,
    prices: string | undefined,
    brands: string | undefined
  ): Promise<IProduct[]> {
    let brandsArray: string[] = [];
    let queryBrands: Object = {};
    let querySubCat: Object = {};
    let queryComparePrices: Object = {};
    let querySearch: Object = {};
    if (brands) {
      brandsArray = brands.split(',');
    }
    if (brandsArray) {
      brandsArray.map((e: string) => new RegExp(e, 'i'));
    }
    if (subCat) {
      querySubCat = { subCategory: Types.ObjectId(subCat) };
    }
    if (prices) {
      queryComparePrices = {
        price: {
          $gt: parseInt(prices.split(',')[0], 10),
          $lt: parseInt(prices.split(',')[1], 10),
        },
      };
    }
    if (brandsArray && brandsArray.length > 0) {
      queryBrands = { brand: { $in: brandsArray } } || {};
    }
    if (text) {
      querySearch = { name: { $regex: text || '', $options: 'i' } };
    }
    return this.productModel
      .find({
        $and: [querySubCat, querySearch, queryComparePrices, queryBrands],
      })
      .limit(10);
  }
}
