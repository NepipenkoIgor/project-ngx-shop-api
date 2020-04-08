import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { feedbackSchema } from './feedbacks.schema';

@Module({
  providers: [FeedbacksService],
  imports: [
    MongooseModule.forFeature([{ name: 'Feedbacks', schema: feedbackSchema }]),
  ],
  controllers: [FeedbacksController],
})
export class FeedbacksModule {}
