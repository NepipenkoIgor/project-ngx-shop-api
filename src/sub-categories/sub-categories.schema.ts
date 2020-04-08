import * as mongoose from 'mongoose';

export const subCategoriesSchema: mongoose.Schema = new mongoose.Schema({
  category: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    required: true,
    type: String,
  },
});
