const express = require("express");
const app = express();

const path = require("path");
const productosJsonPath = path.join(__dirname, "productos.json");

const ProductManager = require("./productManager");
const productManager = new ProductManager(productosJsonPath);

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit, products.lenght));
    res.send(limitedProducts);
  } else {
    res.send(products);
  }
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  if (!pid) {
    res.status(404).send({ error: `No existe ningún Producto con el id ${pid}` });
  } else {
    res.send(product);
  }
});

app.listen(8080, () => {
  console.log("Servidor en funcionamiento");
});