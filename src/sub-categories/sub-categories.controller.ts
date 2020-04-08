import { SubCategoriesService } from './sub-categories.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SubCategotyDto } from './sub-categories.dto';

@ApiTags('subcategories')
@Controller('subcategories')
export class SubCategoriesController {
  public constructor(private subCategoriesService: SubCategoriesService) {}

  @Get('')
  @Put(':id')
  @ApiOperation({ description: 'Update sub category by id' })
  @ApiResponse({
    description: 'Sub category was successfully updated',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  // tslint:disable-next-line: typedef
  public async updateSubCategory(
    @Body() subCategory: SubCategotyDto,
    // tslint:disable-next-line:no-any
    @Param() param: any,
    @Res() res: Response
  ) {
    try {
      // tslint:disable-next-line: typedef
      const updatedSubCategory = await this.subCategoriesService.updateSubCategory(
        param.id,
        subCategory.name
      );
      return res
        .status(HttpStatus.OK)
        .json({ data: updatedSubCategory, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
