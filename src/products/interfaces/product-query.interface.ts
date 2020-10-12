export interface IProductQuery {
  subCategory: string;
  price?: IPriceProductQuery;
  text?: { $regex: string; $options: string };
  brand?: { $in: RegExp[] };
}

export interface IPriceProductQuery {
  $gt?: number;
  $lt?: number;
}
