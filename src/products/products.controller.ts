import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { IProduct } from './interfaces/product.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  public constructor(private readonly productsService: ProductsService) {}
  @Get('')
  @ApiOperation({ description: 'Get products' })
  @ApiResponse({
    description: 'Got Products',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error  find',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  public async findProducts(
    @Res() res: Response,
    @Query('subCat') subCat: string | undefined,
    @Query('text') text: string | undefined,
    @Query('prices') prices: string | undefined,
    @Query('brands') brands: string | undefined
  ): Promise<Response> {
    try {
      const products: IProduct[] = await this.productsService.findProdcuts(
        subCat,
        text,
        prices,
        brands
      );
      return res.status(HttpStatus.OK).json({ data: products, error: null });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
