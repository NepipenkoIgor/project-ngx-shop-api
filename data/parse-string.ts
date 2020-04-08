import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import ora = require('ora');
const promisifedFileRead = util.promisify(fs.readFile);
const promisifiedReadDir = util.promisify(fs.readdir);
const url = 'mongodb://JSDaddy:jsdaddy2018@ds229909.mlab.com:29909/heroku_4k4jx5rj';

const main = async() =>{
  const spinner = ora('Loading').start();  
  try{
    spinner.text = 'Connect to db';
      const connection = await mongodb.MongoClient.connect(url,  { useNewUrlParser: true });
      const dbo = connection.db('heroku_4k4jx5rj');

      const categories = await readJson('json-categories.json');
      await loadCategories(dbo, categories, spinner);

      const subCategories = await readJson('json-sub-categories.json');        
      await loadSubCategories(dbo, subCategories, spinner);   

      const productsFileNames = await promisifiedReadDir(
        path.resolve(__dirname, 'output'),
      );
      await loadProducts(dbo, productsFileNames, spinner);
  } catch(error){
    console.log(error);
  } finally {
    spinner.stop();
  }

};
main();

async function loadCategories(dbo: any, categories: any, spinner: any) {
  spinner.text = 'Loading categories';
  try{
    for (const category of categories) {
      category._id = mongoose.Types.ObjectId(category._id);
      await dbo.collection('categories').insertOne(category);
    }
  }
  catch(e){
    spinner.stop();
    console.log(e);
  }
  spinner.stop();
  console.log('\n Categories added');
};

async function loadSubCategories(dbo: any, subCategories: any, spinner: any) {
  spinner.start();
  spinner.text = 'Loading subCategories';
  try{
    for (const subCategory of subCategories) {
      subCategory._id = mongoose.Types.ObjectId(subCategory._id);
      subCategory.category =  mongoose.Types.ObjectId(subCategory.category);
      await dbo.collection('subCategories').insertOne(subCategory);
    }
  } catch(e){
    spinner.stop();
    console.log(e);
  }
  spinner.stop();
  console.log('\n SubCategories added');
};
async function loadProducts (dbo: any, productsFileNames: any, spinner: any) {
  spinner.start(); 
  spinner.text = 'Loading products'; 
   try{
    for (let i = 0; i < productsFileNames.length; i++) {
        const products = await readJson(`output/${productsFileNames[i]}`);
        for (const product of products) {
          product._id = mongoose.Types.ObjectId(product._id);
          product.subCategory = mongoose.Types.ObjectId(product.subCategory);
          await dbo.collection('products').insertOne(product);
          
        }
    }
  } catch(e){
    spinner.stop();
    console.log(e);
  }
  spinner.stop();
  console.log('\n Products added');
};

async function readJson(fileName: string){
  const buffer: Buffer = await promisifedFileRead(
    path.resolve(__dirname, fileName)
  );
return JSON.parse(buffer.toString())
};

