const express = require('express')
const cors=require('cors')
const app = express()
const port = 3000

// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://theBookHaven:IUVY4C5fnjLSAKkI@cluster0.msoxyyg.mongodb.net/?appName=Cluster0";

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
    // await client.connect();
    const db=client.db('theBookHaven');
    const bookCollection=db.collection('allBooks');

   app.get('/allBooks',async(req,res)=>{
    const sortOrder=req.query.sort==='asc'? 1 : -1;
    const result=await bookCollection.find().sort({rating: sortOrder}).toArray();
    console.log(result);
    res.send(result);
     });

    app.get('/bookDetails/:id',async (req,res)=>{
      const {id}=req.params;
      console.log(id);
      const objectId=new ObjectId(id)
      const result=await bookCollection.findOne({_id:objectId})

      res.send({
        success:true,
        result
      })
    });

    app.post('/allBooks',async(req,res)=>{
      const data=req.body;
      const result=await bookCollection.insertOne(data);

      res.send({
        result,
      })
    });

    app.get('/latest-books',async(req,res)=>{
      const result=await bookCollection.find().sort({_id:-1}).limit(6).toArray();
      res.send(result);
    });

    app.get('/my-books',async(req,res)=>{
      const email=req.query.email;
      const result=await bookCollection.find({userEmail : email}).toArray();
      res.send(result);
    });

    app.put('/bookDetails/:id',async(req,res)=>{
      const {id}=req.params;
      const data=req.body;
      const objectId=new ObjectId(id);
      const filter={_id:objectId}
      const update={
        $set:data
      };

       const result=await bookCollection.updateOne(filter,update)

      res.send({
        success:true,
        result,
      })
    });


    app.delete('/bookDetails/:id',async(req,res)=>{
      const {id}=req.params;
      const result=await bookCollection.deleteOne({_id:new ObjectId(id)})

      res.send({
        success:true,
        result,
      })
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





