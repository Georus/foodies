const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.account}:${process.env.password}@cluster0.szp0tzo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const numberOfRecipes = 10;

exports.handler = async function (event, context) {
  let setSize = 0;
  try {
    await client.connect();
    await client.db("test").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const current = event["multiValueQueryStringParameters"]["current[]"];

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

    const res = {
      results: foods,
      cursor: foodArray.length >= numberOfRecipes ? null : 1,
    };

    return formatResponse(serialize(res));
  } catch (error) {
    return formatError(error);
  } finally {
    await client.close();
  }
};

const formatResponse = function (body) {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    isBase64Encoded: false,
    multiValueHeaders: {
      "X-Custom-Header": ["My value", "My other value"],
    },
    body: body,
  };
  return response;
};

const formatError = function (error) {
  const response = {
    statusCode: error.statusCode,
    headers: {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": error.code,
    },
    isBase64Encoded: false,
    body: error.code + ": " + error.message,
  };
  return response;
};

const serialize = function (object) {
  return JSON.stringify(object, null, 2);
};
