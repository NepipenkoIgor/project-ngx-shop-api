import { IProduct, IFeedbackFromJson } from './interfaces';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';
import { random } from 'lodash';

const promisifiedFileRead: (
  filename: string
) => Promise<Buffer> = util.promisify(fs.readFile);

const dbPath: string = process.env.DATABASE_PATH as string;
const dbName: string = process.env.DATABASE_NAME as string;
async function main(): Promise<void> {
  const spinner: ora.Ora = ora('Loading').start();
  try {
    spinner.text = 'Connect to db';
    const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
      dbPath,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db: Db = connection.db(dbName);
    spinner.text = 'Loading feedbacks';
    const feedbacks: IFeedbackFromJson[] = await readJSON(
      `output/json-feedbacks.json`
    );
    const products: IProduct[] = await db
      .collection('products')
      .find({}, { projection: { _id: true } })
      .toArray();
    for (let i: number = 0; i < products.length; i++) {
      for (let j: number = 0; j < random(1, 5); j++) {
        const rand: number = random(0, 4);
        await db.collection('feedbacks').insertOne({
          _id: mongoose.Types.ObjectId(),
          product: products[i]._id,
          advantages: feedbacks[rand].text,
          rate: feedbacks[rand].rating,
        });
      }
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
  } finally {
    spinner.stop();
  }
}
main();
async function readJSON<T>(fileName: string): Promise<T> {
  const buffer: Buffer = await promisifiedFileRead(
    path.resolve(__dirname, fileName)
  );
  return JSON.parse(buffer.toString());
}
