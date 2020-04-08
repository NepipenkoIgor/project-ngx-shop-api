import { Types } from 'mongoose';

export interface IProductQuery {
  subCategory: Types.ObjectId;
  price: {
    $gt: number;
    $lt: number;
  };
  name: { $regex: string; $options: string };
  brand: { $in: RegExp[] };
}
