const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl5czkc.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect(); // needs to be commented to avoid vercel error
        // needs to be commented to avoid vercel error


        const brandNameCollection = client.db('brandShop').collection('brandNames');
        const myCarCollection = client.db('brandShop').collection('myCars');
        const carCart = client.db('brandShop').collection('carCart');

        // to get all the brandNames
        app.get('/brands', async (req, res) => {
            const cursor = brandNameCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // to get specific brand cars by filter
        app.get('/brands/:name', async (req, res) => {
            const brand = req.params.name;
            const query = { brand: brand };
            const result = await myCarCollection.find(query).toArray();
            res.send(result);
        })
        // to get a specific car
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await myCarCollection.findOne(query);
            res.send(result);
        })
        // for Cart
        // to get specific user's car from cart by filter
        app.get('/cart/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await carCart.find(query).toArray();
            res.send(result);
            // console.log(result);
        })
        // to update a car
        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCar = req.body;

            const car = {
                $set: {
                    image: updatedCar.photo,
                    name: updatedCar.name,
                    brand: updatedCar.brand,
                    type: updatedCar.type,
                    price: updatedCar.price,
                    short_description: updatedCar.short_des,
                    short_description: updatedCar.short_des,
                    rating: updatedCar.rating
                }
            }

            const result = await myCarCollection.updateOne(filter, car, options);
            res.send(result);
        })
        // to add a car in myCarCollection
        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            const result = await myCarCollection.insertOne(newCar);
            res.send(result);
        })
        // to add a car in carCart
        app.post('/cart', async (req, res) => {
            const newCarToCart = req.body;
            const result = await carCart.insertOne(newCarToCart);
            res.send(result);
        })
        // to delete a car from cart 
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCart.deleteOne(query);
            res.send(result);
        })
        




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 }); // needs to be commented to avoid vercel error
        // console.log("Pinged your deployment. You successfully connected to MongoDB!"); // needs to be commented to avoid vercel error
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car Brand Shop server is running')
})

app.listen(port, () => {
    console.log(`My Car Brand Shop is running on port: ${port}`)
})