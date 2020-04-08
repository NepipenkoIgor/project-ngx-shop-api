import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';

const url = 'mongodb://JSDaddy:jsdaddy2018@ds229909.mlab.com:29909/heroku_4k4jx5rj';

const main = async() =>{

  
      const connection = await mongodb.MongoClient.connect(url,  { useNewUrlParser: true });
      const dbo = connection.db('heroku_4k4jx5rj');
        let subCategories = await dbo.collection('subCategories').find() as any;
        for(let key of subCategories){
            key.category = mongoose.Types.ObjectId(key._id);
        }
 console.log(subCategories);

};
main();
