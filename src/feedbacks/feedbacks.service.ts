import { IFeedback } from './interfaces/feedbacks.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackDto } from './dtos/feedbacks.dto';

@Injectable()
export class FeedbacksService {
  public constructor(
    @InjectModel('Feedbacks') private readonly feedbackModel: Model<IFeedback>
  ) {}
  public async createFeedback(feedback: FeedbackDto): Promise<void> {
    await new this.feedbackModel(feedback).save();
  }
}
