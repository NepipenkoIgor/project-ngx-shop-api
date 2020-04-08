import { Document } from 'mongoose';
export interface IFeedback extends Document {
  product: string;
  rate: number;
  advantages?: string;
  limitations?: string;
  description: string;
}
