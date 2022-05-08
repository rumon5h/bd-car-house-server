const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carexportcompany.plhyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const carCollection = client.db("cars").collection("car");
        const expertCollection = client.db("experts").collection("expert");
        const serviceCollection = client.db('services').collection('service');

        // GET SERVICES DATA
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET CARS DATA
        app.get('/cars', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            
            const cursor = carCollection.find({});
            const cars = await cursor.skip(page*size).limit(size).toArray();         
            res.send(cars)
        });

        // GET SINGLE CAR
        app.get('/car/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const car = await carCollection.findOne(query);
            res.send(car)
        });

        // DELETE A CAR
        app.delete('/car/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await carCollection.deleteOne(query);
            res.send(result)
        })

        // POST NEW CAR
        app.post('/car', async(req, res) =>{
            const car = req.body;
            const result = await carCollection.insertOne(car);
            console.log(result);
            res.send(result)
        });

        // GET MY CARS
        app.get('/myCar', async(req, res)=>{
           const email = req.query.email;
           const query = {email}
           const cursor = carCollection.find(query);
           const result = await cursor.toArray();
           res.send(result)
        })
        
        // GET EXPERTS INFORMATION
        app.get('/experts', async(req, res) =>{
            const cursor = expertCollection.find({});
            const experts = await cursor.toArray();
            res.send(experts)
        });

        // GET PAGE COUNT
        app.get('/carCount', async(req, res) =>{
            
            const count = await carCollection.estimatedDocumentCount();
            res.send({count})
        })
        

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(req.params);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    ...data
                },
            };
            console.log(data);
            const result = await carCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(port, (req, res) => {
    console.log('Listening to port', port);
});