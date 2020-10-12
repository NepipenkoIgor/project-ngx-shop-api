import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductsService } from 'products/products.service';
import { BrandsPipe } from './brands.pipe';
import { IPriceProductQuery } from 'products/interfaces/product-query.interface';
import { IProduct } from 'products/interfaces/product.interface';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  public constructor(private productsService: ProductsService) {}

  @Get('')
  @ApiOperation({ description: 'Get brands' })
  @ApiResponse({
    description: 'brands was successfully got',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  public async findCategories(
    @Res() res: Response,
    @Query('subCat') subCategory: string,
    @Query('prices', new BrandsPipe())
    price: IPriceProductQuery
  ): Promise<Response> {
    try {
      const products: IProduct[] = await this.productsService.findProducts({
        subCategory,
        price,
      });
      const brands: (string | undefined)[] = products
        .map((product: IProduct) => {
          return product.brand;
        })
        .filter(
          (x: string | undefined, i: number, a: (string | undefined)[]) =>
            a.indexOf(x) === i
        );
      return res.status(HttpStatus.OK).json({ data: brands, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
