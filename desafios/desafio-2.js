const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  getProducts() {
    return getJsonFromFile(this.path);
  }

  async addProduct(productAdd) {
    const { title, code, thumbnail, price, stock, description } = productAdd;
    const products = await getJsonFromFile(this.path);

    if (
      !productAdd.title ||
      !productAdd.code ||
      !productAdd.thumbnail ||
      !productAdd.price ||
      !productAdd.stock ||
      !productAdd.description
    ) {
      console.log(`Faltan campos obligatorios`);
      return;
    }
    if (products.some((products) => products.code === productAdd.code)) {
      console.log(
        "Este producto ya se encuentra en el array y no se va a agregar"
      );
    } else {
      const id = products.length + 1;
      const newProduct = {
        id,
        title,
        code,
        thumbnail,
        price,
        stock,
        description,
      };
      products.push(newProduct);
      console.log("Se agregó correctamente el producto");
      return saveJsonToFile(this.path, products);
    }
  }

  async getProductById(productId) {
    const products = await getJsonFromFile(this.path);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      console.log(`no se encontro el id ${productId} solicitado`);
    }
    return product;
  }

  async updateProduct(productId, updatedProduct) {
    const products = await getJsonFromFile(this.path);
    let { title, code, thumbnail, price, stock, description } = updatedProduct;
    const product = products.findIndex((p) => p.id === productId);
    if (product === -1) {
      console.log(`no se encontro el id ${productId} solicitado if`);
      return null;
    }

    const properties = [
      "title",
      "code",
      "thumbnail",
      "price",
      "stock",
      "description",
    ];
    for (const prop in updatedProduct) {
      if (!properties.includes(prop)) {
        console.log(`La propiedad ${prop} no es permitida`);
        return null;
      }
    }

    if (
      !updatedProduct.title ||
      !updatedProduct.code ||
      !updatedProduct.thumbnail ||
      !updatedProduct.price ||
      !updatedProduct.stock ||
      !updatedProduct.description
    ) {
      console.log(`Faltan campos obligatorios`);
      return;
    }
    
    let newUpdatedProduct = {
      title,
      code,
      thumbnail,
      price,
      stock,
      description,
      id: productId,
    };

    products[product] = {
      ...products[product],
      ...newUpdatedProduct,
      id: productId,
    };

    try {
      await saveJsonToFile(this.path, products);
      console.log(`Producto con ID ${productId} actualizado exitosamente`);
      return products[product];
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
      return null;
    }
  }

  async deleteProduct(productId) {
    const products = await getJsonFromFile(this.path);
    const product = products.findIndex((p) => p.id === productId);
    if (product === -1) {
      console.log(`no se encontro el id ${productId} solicitado if`);
      return null;
    }
    products.splice(product, 1);

    try {
      await saveJsonToFile(this.path, products);
      console.log(`Producto con ID ${productId} eliminado exitosamente`);
      return productId;
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
      return null;
    }
  }
}

// Funciones de archivo JSON

//SI EXISTE EL ARCHIVO JSON
const existFile = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

//OBTENER EL ARCHIVO JSON

const getJsonFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  }
  let content;

  try {
    content = await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    throw new Error("El archivo lamentablemente no pudo ser leido");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error("El archivo no tiene un formato JSON correcto");
  }
};

//GUARDAR ARCHIVO JSON
const saveJsonToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.promises.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error("El archivo lamentablemente no pudo ser guardado");
  }
};

(async function (run) {
  if (!run) return;

  const productManager = new ProductManager("./productos.json");
  //SE AGREGA PRODUCTO
  await productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  //SE OBTIENE LOS PRODUCTOS POR ID Y EN GENERAL
  const users1 = await productManager.getProducts();
  console.log("el listdo del los productos es: ", users1);

  const user1 = await productManager.getProductById(1);
  console.log("el producto por el id es: ", user1);

  // SE ACTUALIZA EL PRODUCTO

  const cambio = {
    title: "update24",
    description: "Este es un producto prueba de update",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
    mila: "mila",
  };

  await productManager.updateProduct(1, cambio);

  //await productManager.deleteProduct(1)

  //SE OBTIENE LOS PRODUCTOS POR ID Y EN GENERAL

  //const users = await productManager.getProducts();
  // console.log('el listdo del los productos es: ', users)

  //const user = await productManager.getProductById(1);
  //console.log('el producto por el id es: ', user)
})(true);
