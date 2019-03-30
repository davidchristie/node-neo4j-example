const neo4j = require("neo4j-driver").v1;
const uuid = require("uuid/v1");

const url = process.env.NEO4J_HOST || "bolt://neo4j:7687";
const user = process.env.NEO4J_USER || "neoj4";
const password = process.env.NEO4J_PASSWORD || "neo4j";
const driver = neo4j.driver(url, neo4j.auth.basic(user, password));

async function createProduct({ name }) {
  const id = uuid();
  const session = driver.session();
  await session.run(
    "CREATE (p:Product { id: $id, name: $name }) RETURN p AS product",
    {
      id,
      name
    }
  );
  session.close();
}

async function deleteProduct(id) {
  const session = driver.session();
  await session.run("MATCH (p:Product { id: $id }) DELETE p", {
    id
  });
  session.close();
}

async function getProduct(id) {
  const session = driver.session();
  const result = await session.run(
    "MATCH (p:Product { id: $id }) RETURN p AS product LIMIT 1",
    {
      id
    }
  );
  session.close();
  const exists = result.records.length > 0;
  return exists ? result.records[0].get("product").properties : null;
}

async function getProducts() {
  const session = driver.session();
  const result = await session.run("MATCH (p:Product) RETURN p AS products");
  session.close();
  return result.records.map(record => {
    return record.get("products").properties;
  });
}

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts
};
