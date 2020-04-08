import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { IProduct } from './interfaces/product.interface';
import { ParseInt } from './parse-int.pipe';

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
  @ApiQuery({ name: 'subCat', required: false, description: 'Subcategory ID' })
  @ApiQuery({ name: 'text', required: false, description: 'Search by name' })
  @ApiQuery({ name: 'prices', required: false, description: '100,500' })
  @ApiQuery({ name: 'brands', required: false, description: 'apple,samsung' })
  @ApiQuery({ name: 'page', required: false, description: 'Number page' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit items' })
  public async findProducts(
    @Res() res: Response,
    @Query('subCat') subCat: string | undefined,
    @Query('text') text: string | undefined,
    @Query('prices') prices: string | undefined,
    @Query('brands') brands: string | undefined,
    @Query('page', new ParseInt()) page: number,
    @Query('limit', new ParseInt()) limit: number
  ): Promise<Response> {
    try {
      const products: [
        IProduct[],
        {}
      ] = await this.productsService.findProdcuts(
        subCat,
        text,
        prices,
        brands,
        page,
        limit
      );
      return res.status(HttpStatus.OK).json({
        data: { items: products[0], pagination: products[1] },
        error: null,
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
  @Get(':id')
  @ApiOperation({ description: 'Get one product by id' })
  @ApiResponse({
    description: 'Got one product by id ',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error  find',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  public async findProduct(
    @Res() res: Response,
    @Param('id') param: string
  ): Promise<Response> {
    try {
      const product: IProduct[] = await this.productsService.findProdcut(param);
      return res.status(HttpStatus.OK).json({ data: product[0], error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
