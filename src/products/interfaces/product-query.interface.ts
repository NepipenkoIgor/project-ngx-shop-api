import { Types } from 'mongoose';

export interface IProductQuery {
  slug: string;
  price: {
    $gt: number;
    $lt: number;
  };
  name: { $regex: string; $options: string };
  brand: { $in: RegExp[] };
}
