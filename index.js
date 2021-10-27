const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
app = express();
const port = process.env.PORT || 5000;
//middleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ns6st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
      
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        //get Api
        app.get('/services',async(req,res)=>{
          const cursor = servicesCollection.find({}) 
          const services = await cursor.toArray();
          res.send(services)
        })
        //Get Single Service 
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        //post Api
        app.post('/services',async(req, res)=>{
            const service = req.body;
            console.log('hit the post api',service)
            const result = await servicesCollection.insertOne(service);

            res.json(result)
        })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })