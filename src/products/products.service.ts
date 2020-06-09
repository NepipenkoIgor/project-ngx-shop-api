import { IProduct } from './interfaces/product.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IProductQuery } from './interfaces/product-query.interface';
@Injectable()
export class ProductsService {
  public constructor(
    @InjectModel('Products') private readonly productModel: Model<IProduct>
  ) {}

  public async suggestedProdcuts(
  ): Promise<[IProduct[]]> {
    const products: IProduct[] = await this.productModel
      .aggregate([
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
            rating: {
              $avg: { $cond: [{ $ifNull: ['$feedbacks.rate', null] }, 1, 0] },
            },
            status: { $first: '$status' },
          },
        },
        { $sample: { size: 9} }
 
      ])
      .allowDiskUse(true);
    return [products];
  }
  public async findProdcuts(
    subCat: string | undefined,
    text: string | undefined,
    prices: string | undefined,
    brands: string | undefined,
  ): Promise<[IProduct[]]> {
    let brandsArray: string[] = [];
    let regExpBrandsArray: RegExp[] = [];
    let queryBrands: Partial<IProductQuery> = {};
    let querySubCat: Partial<IProductQuery> = {};
    let queryComparePrices: Partial<IProductQuery> = {};
    let querySearch: Partial<IProductQuery> = {};
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
    const products: IProduct[] = await this.productModel
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
            rating: {
              $avg: { $cond: [{ $ifNull: ['$feedbacks.rate', null] }, 1, 0] },
            },
            status: { $first: '$status' },
          },
        },
      ])
      .allowDiskUse(true);
    return [products];
  }
  public async findProdcut(_id: string): Promise<IProduct[]> {
    return this.productModel.aggregate([
      { $match: { _id: Types.ObjectId(_id) } },
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
          description: { $first: '$description' },
          feedbacks: { $push: '$feedbacks' },
          feedbacksCount: {
            $sum: {
              $cond: [{ $ifNull: ['$feedbacks', null] }, 1, 0],
            },
          },
          images: { $first: '$images' },
          name: { $first: '$name' },
          price: { $first: '$price' },
          rating: {
            $avg: { $cond: [{ $ifNull: ['$feedbacks.rate', null] }, 1, 0] },
          },
          status: { $first: '$status' },
          subCategory: { $first: '$subCategory' },
          characteristics: { $first: '$characteristics' },
          brand: { $first: '$brand' },
        },
      },
    ]);
  }
}
