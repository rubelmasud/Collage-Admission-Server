const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// Midleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oikc1wt.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();


        const userCollection = client.db('CollegeBooking').collection('Users')
        const collegesCollection = client.db('CollegeBooking').collection('Colleges')
        const admissionsCollection = client.db('CollegeBooking').collection('admissions')


        app.get('/UpdateUser/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const exitingUser = await userCollection.findOne(query)
            if (exitingUser) {
                return res.send({ message: "Is User Already Exist" })
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.patch("/updatedUser/:email", async (req, res) => {
            const email = req.params.email;
            console.log(email, 'email');
            const body = req.body;
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    name: body.name,
                    image: body.image,
                    email: body.email,
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });


        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray()
            res.send(result)
        })

        // search by name
        app.get("/AllCollege/:text", async (req, res) => {
            const text = req.params.text;
            const result = await collegesCollection
                .find({
                    $or: [
                        { name: { $regex: text, $options: "i" } },
                        { subCategory: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });


        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id, 'id');
            const query = { _id: new ObjectId(id) };
            const result = await collegesCollection.findOne(query)
            res.send(result)
        })

        app.get('/PopularColleges', async (req, res) => {
            const result = await collegesCollection.find().limit(4).toArray()
            res.send(result)
        })


        app.post('/admissions', async (req, res) => {
            const admission = req.body
            const result = await admissionsCollection.insertOne(admission);
            res.send(result)
        })


        app.get('/my_admissions/:email', async (req, res) => {
            const email = req.params.email
            const query = { StudentEmail: email }
            const result = await admissionsCollection.find(query).toArray();
            res.send(result);
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
    res.send('College is open')
})

app.listen(port, () => {
    console.log(`college is open in port : ${port}`);
})