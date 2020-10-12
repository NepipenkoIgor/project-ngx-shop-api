import { ProductsService } from 'products/products.service';
import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from 'products/products.schema';

@Module({
  controllers: [BrandsController],
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: productSchema }]),
  ],
  providers: [ProductsService],
})
export class BrandsModule {}
