import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
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
  public async findProducts(@Res() res: Response): Promise<Response> {
    try {
      const products: IProduct[] = await this.productsService.findProdcuts();
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
