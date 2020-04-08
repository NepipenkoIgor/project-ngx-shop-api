import { SubCategoriesController } from './sub-categories.controller';
import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { subCategoriesSchema } from './sub-categories.schema';
import { productSchema } from 'products/products.schema';

@Module({
  controllers: [SubCategoriesController],
  imports: [
    MongooseModule.forFeature([
      { name: 'SubCategories', schema: subCategoriesSchema },
      { name: 'Products', schema: productSchema },
    ]),
  ],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
