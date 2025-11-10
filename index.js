const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartDBUser:NODWkeEd9GMTIaas@cluster0.cjsthkf.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    const database = client.db("smartDeal");
    const productCollection = database.collection("products");
    const bidsCollection = database.collection("bids");
    const usersCollection = database.collection("users");

    //Products related API---------------
    //Get
    app.get("/products", async (req, res) => {
      // const sort = {price_min : 1};
      // const limitProducts = 5
      // const skip = 1;
      // const project = { title :1, price_min:1,email:1}
      // const cursor = productCollection.find().sort(sort).limit(limitProducts).skip(skip).project(project);
      //   const query = query.
      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Find
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //Post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //Update
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
        },
      };
      const option = {};
      const result = await productCollection.updateOne(query, update, option);
      res.send(result);
    });

    //Delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      //   const query = { _id: new ObjectId(id) };
      const query = { _id: id };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //bids related api --------------------
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await bidsCollection.deleteOne(query);
      res.send(result);
    });

    //users related api --------------------
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send({ message: "User already exists" });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
