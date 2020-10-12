import * as mongodb from 'mongodb';
import * as ora from 'ora';
import { Db } from 'mongodb';

const dbName: string = process.env.DATABASE_NAME as string;
const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;

async function main(): Promise<void> {
  const spinner: ora.Ora = ora('Loading').start();
  let db: Db;
  let connection: mongodb.MongoClient;
  try {
    spinner.text = 'Connect to db';
    connection = await mongodb.MongoClient.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(dbName);
    spinner.text = 'Deleting...';
    await db.dropDatabase();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
    process.exit();
  }
  spinner.stop();
  await connection.close();
}

main();
