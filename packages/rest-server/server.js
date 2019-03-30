const bodyParser = require("body-parser");
const express = require("express");
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
} = require("./neo4j");

const server = express();

server.use(bodyParser.json());

server.post("/products", async (request, response) => {
  const { name } = request.body;
  await createProduct({
    name
  });
  return response.send();
});

server.get("/products", async (request, response) => {
  const products = await getProducts();
  return response.json({
    data: products
  });
});

server.delete("/products/:id", async (request, response) => {
  const id = request.params.id;
  await deleteProduct(id);
  return response.send();
});

server.get("/products/:id", async (request, response) => {
  const id = request.params.id;
  const product = await getProduct(id);
  return response.json({
    data: product
  });
});

module.exports = server;
