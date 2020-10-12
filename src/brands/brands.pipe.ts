import { Injectable, PipeTransform } from '@nestjs/common';
import { IPriceProductQuery } from 'products/interfaces/product-query.interface';

@Injectable()
export class BrandsPipe implements PipeTransform {
  public transform(value: string): IPriceProductQuery {
    if (value) {
      return {
        $gt: parseInt(value.split(',')[0], 10),
        $lt: parseInt(value.split(',')[1], 10),
      };
    }
    return {
      $gt: 0,
      $lt: Number.MAX_SAFE_INTEGER,
    };
  }
}
