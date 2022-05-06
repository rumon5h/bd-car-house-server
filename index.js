const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// Middleware
app.use(express());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carexportcompany.plhyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const carCollection = client.db("cars").collection("car");
        const expertCollection = client.db("experts").collection("expert");
        

        // GET CARS DATA
        app.get('/cars', async (req, res) => {
            const cursor = carCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars)
        });

        // GET EXPERTS INFORMATION
        app.get('/experts', async(req, res) =>{
            const cursor = expertCollection.find({});
            const experts = await cursor.toArray();
            res.send(experts)
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