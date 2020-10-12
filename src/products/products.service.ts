import { IProduct } from './interfaces/product.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProductQuery } from './interfaces/product-query.interface';
@Injectable()
export class ProductsService {
  public lookupFeedbacks: Record<string, unknown> = {
    $lookup: {
      as: 'feedbacks',
      foreignField: 'product',
      from: 'feedbacks',
      localField: '_id',
    },
  };
  public unwindFeedbacks: Record<string, unknown> = {
    $unwind: { path: '$feedbacks', preserveNullAndEmptyArrays: true },
  };

  public groupFeedbacks: Record<string, unknown> = {
    $group: {
      _id: '$_id',
      feedbacksCount: {
        $sum: {
          $cond: [{ $ifNull: ['$feedbacks', null] }, 1, 0],
        },
      },
      subCategory: { $first: '$subCategory' },
      images: { $first: '$images' },
      name: { $first: '$name' },
      price: { $first: '$price' },
      brand: { $first: '$brand' },
      rating: {
        $avg: '$feedbacks.rate',
      },
      status: { $first: '$status' },
    },
  };
  public constructor(
    @InjectModel('Products') private readonly productModel: Model<IProduct>
  ) {}

  public async suggestedProducts(): Promise<IProduct[]> {
    const products: IProduct[] = await this.productModel
      .aggregate([
        this.lookupFeedbacks,
        this.unwindFeedbacks,
        this.groupFeedbacks,
        { $sample: { size: 9 } },
      ])
      .allowDiskUse(true);
    return products;
  }
  public async findProducts(query: IProductQuery): Promise<IProduct[]> {
    return await this.productModel
      .aggregate([
        {
          $match: query,
        },
        this.lookupFeedbacks,
        this.unwindFeedbacks,
        this.groupFeedbacks,
      ])
      .allowDiskUse(true);
  }
  public async findProduct(_id: string): Promise<IProduct[]> {
    return this.productModel.aggregate([
      { $match: { _id } },
      this.lookupFeedbacks,
      this.unwindFeedbacks,
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
            $avg: '$feedbacks.rate',
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
