const http = require("http");
const url = require("url");
const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.account}:${process.env.password}@cluster0.szp0tzo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const numberOfRecipes = 10;

const wordInString = (s, word) => new RegExp("\\b" + word + "\\b", "i").test(s);

http
  .createServer(async (req, res) => {
    let setSize = 0;
    try {
      if (wordInString(req.url, "food")) {
        await client.connect();
        await client.db("test").command({ ping: 1 });
        console.log(
          "Pinged your deployment. You successfully connected to MongoDB!"
        );
        const queryData = url.parse(req.url, true).query;
        const current = queryData["current[]"];

        const foodSet = new Set();
        if (current) {
          current.forEach((item) => foodSet.add(parseInt(item)));
          setSize = foodSet.size;
        }

        while (foodSet.size < setSize + 5) {
          const foodIndex = Math.ceil(Math.random() * numberOfRecipes);
          foodSet.add(foodIndex);
        }
        const foodArray = [...foodSet];

        const foods = await client
          .db("test")
          .collection("food")
          .find({ id: { $in: foodArray } })
          .toArray();

        const response = {
          results: foods,
          cursor: foodArray.length >= numberOfRecipes ? null : 1,
        };

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });

        res.write(JSON.stringify(response, null, 2));
        res.end();
      } else {
        res.writeHead(404);
        res.end("Page not found");
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("Internal server error");
      res.end();
    } finally {
      await client.close();
    }
  })
  .listen(3000);
