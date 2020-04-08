import { IProduct } from './interfaces/product.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class ProductsService {
  public constructor(
    @InjectModel('Products') private readonly productModel: Model<IProduct>
  ) {}
  public async findProdcuts(
    subCat: string | undefined,
    text: string | undefined,
    prices: string | undefined,
    brands: string | undefined
  ): Promise<IProduct[]> {
    let brandsArray: string[] = [];
    let regExpBrandsArray: RegExp[] = [];
    let queryBrands: Object = {};
    let querySubCat: Object = {};
    let queryComparePrices: Object = {};
    let querySearch: Object = {};
    if (brands) {
      brandsArray = brands.split(',');
    }
    if (brandsArray) {
      regExpBrandsArray = brandsArray.map((e: string) => new RegExp(e, 'i'));
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
    if (regExpBrandsArray && regExpBrandsArray.length > 0) {
      queryBrands = { brand: { $in: regExpBrandsArray } } || {};
    }
    if (text) {
      querySearch = { name: { $regex: text || '', $options: 'i' } };
    }
    return this.productModel
      .aggregate([
        {
          $match: {
            $and: [queryBrands, querySubCat, querySearch, queryComparePrices],
          },
        },
        {
          $lookup: {
            as: 'feedbacks',
            foreignField: 'product',
            from: 'feedbacks',
            localField: '_id',
          },
        },
        { $unwind: { path: '$feedbacks', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            feedbacksCount: {
              $sum: {
                $cond: [{ $ifNull: ['$feedbacks', null] }, 1, 0],
              },
            },
            images: { $first: '$images' },
            name: { $first: '$name' },
            price: { $first: '$price' },
            rating: { $avg: '$feedbacks.rate' },
            status: { $first: '$status' },
          },
        },
      ])
      .limit(10)
      .allowDiskUse(true);
  }
}
