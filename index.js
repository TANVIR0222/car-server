const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



//const uri = "mongodb+srv://<username>:<password>@cluster0.htwfwrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.htwfwrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('service').collection('carDoc');
    const bokingCollection = client.db('service').collection('bokings');



    app.get('/service', async(req,res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result)

    })

    app.get('/service/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id) };
        const options = {
            // Include only the `title` and `imdb` fields in each returned document
            projection: {  title: 1, price: 1 , service_id: 1  },
          };

        const result = await serviceCollection.findOne(query , options);
        res.send(result);
    })

    // boking servise

    app.get('/bokings',async(req,res)=>{
        // only some data show
        let query = {};
        if(req.query?.email){
            query = { email:  req.query.email}
        }
        const result = await bokingCollection.find(query).toArray();
        res.send(result);
    })

    app.post('/bokings',async(req,res)=>{
        const boking = req.body;
        const result = await bokingCollection.insertOne(boking)
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('server is running');
})

app.listen(port, (req,res)=>{
    console.log(`server is running this port : ${port} `);
})
