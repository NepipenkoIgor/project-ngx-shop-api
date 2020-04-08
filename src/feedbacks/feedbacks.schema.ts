import * as mongoose from 'mongoose';

export const feedbackSchema: mongoose.Schema = new mongoose.Schema({
  advantages: {
    required: false,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  limitations: {
    required: false,
    type: String,
  },
  product: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  rate: {
    required: true,
    type: Number,
  },
});
