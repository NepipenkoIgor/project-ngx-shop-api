import { IProduct } from './interfaces/product.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProductsService {
  public constructor(
    // tslint:disable-next-line: no-any
    @InjectModel('Products') private readonly productModel: Model<any>
  ) {}
  public async findProdcuts(): Promise<IProduct[]> {
    return this.productModel.find().limit(10);
  }
}
