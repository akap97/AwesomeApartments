import * as mongodb from 'mongodb';

          const MongoClient = mongodb.MongoClient;
          const uri = "mongodb+srv://akap97:1mp00s1b13@cluster0-2zcgi.mongodb.net/test?retryWrites=true&w=majority";
          const client = new MongoClient(uri, { useNewUrlParser: true });

          client.connect(err => {
            if(err) throw err;
          });
          client.db("AwesomeApartments").collection("images").updateOne({_id:event.target.id}, {$set:{_id:event.target.id, url:file.result.url}}, {upsert:true}) 
          .then((data) =>{
            console.log(data);
          })
          .catch((err) =>{
            console.log(err);
          })