import { IFeedback } from './interfaces/feedbacks.interface';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FeedbacksService } from './feedbacks.service';
import { FeedbackDto } from './dtos/feedbacks.dto';
@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  public constructor(private readonly feedbacksService: FeedbacksService) {}
  @Post('')
  @ApiOperation({ description: 'Create new feedback' })
  @ApiResponse({
    description: 'Feedback was successfully created',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Server error during create new product',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  public async createFeedback(
    @Body() feedback: FeedbackDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const createdFeedback: IFeedback = await this.feedbacksService.createFeedback(
        feedback
      );
      console.log('feedback1111111111', feedback);
      return res
        .status(HttpStatus.OK)
        .json({ data: createdFeedback, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
