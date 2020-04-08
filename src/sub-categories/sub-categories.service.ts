import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SubCategoriesService {
  public constructor(
    // tslint:disable-next-line:no-any
    @InjectModel('SubCategories') private readonly subCategoryModel: Model<any>  ) {}

  // tslint:disable-next-line: typedef
  public async updateSubCategory(id: string, name: string) {
    return await this.subCategoryModel.findOneAndUpdate(
      { _id: Types.ObjectId(id) },
      { $set: { name } }
    );
  }
}
