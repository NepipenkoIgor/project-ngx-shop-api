import { SubCategoriesService } from './sub-categories.service';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('subcategories')
@Controller('subcategories')
export class SubCategoriesController {
  public constructor(private subCategoriesService: SubCategoriesService) {}

  @Get('')
  @ApiOperation({ description: 'Get subcategories' })
  @ApiResponse({
    description: 'Subcategories was successfully got',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  // tslint:disable-next-line: typedef
  public async showSubCategory(
    // tslint:disable-next-line: no-any
    @Param() param: any,
    // tslint:disable-next-line: no-any
    @Param() subCat: any,
    @Res() res: Response
  ) {
    try {
      // tslint:disable-next-line: typedef
      const foundSubCategory = await this.subCategoriesService.showSubCategory(
        param.id,
        subCat.name
      );
      return res
        .status(HttpStatus.OK)
        .json({ data: foundSubCategory, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
