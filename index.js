const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kq3to.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("portfolio");
        const projectsCollection = database.collection("projects");


        // projects API HANDLING //


        // GETTING projects DATA
        app.get('/projects', async (req, res) => {
            const cursor = projectsCollection.find({});
            const projects = await cursor.toArray();
            res.send(projects);
        })
        // GETTING SINGLE bike DATA
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const projects = await projectsCollection.findOne(query);
            res.send(projects);
        })
        // POST BIKE DATA
        app.post('/projects', async (req, res) => {
            const bike = req.body;
            const result = await projectsCollection.insertOne(bike);
            res.json(result);
        })
        // DELETING BIKE DATA
        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await projectsCollection.deleteOne(query);
            res.json(result);
        })

        ///////////////////////////////////////
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hurray! Server is on');
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})


module.exports = app;