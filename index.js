const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// Middleware
app.use(express());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://BdCarHouse:6N9gpLMxzfHYtydL@carexportcompany.plhyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const database = client.db("cars");
        const carsCollection = database.collection("car");

        // GET CARS DATA
        app.get('/cars', async(req, res) =>{
        const query = {};
        const cursor = carsCollection.find(query);
        const cars = await cursor.toArray();
        res.send(cars)
        });
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