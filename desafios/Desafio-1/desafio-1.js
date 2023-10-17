class ProductManager {
  constructor() {
    this.products = [];
    this.nextProductId = 1;
    this.path = "./products.txt"
  }
 async initiate(){
  await fs.writeFile(this.path,[]);
 }
  getProducts() {
    return this.products
  }

  addProducts(productAdd) {
    if (!productAdd.title || !productAdd.code || !productAdd.thumbnail || !productAdd.price || !productAdd.stock || !productAdd.description) {
      console.log(`Faltan campos obligatorios`);
      return;
    } 
    if (this.products.some(product => product.code === productAdd.code)) {
      console.log("Este producto ya se encuentra en el array y no se va a agregar");
    } else {
      const newProduct = {
        id: this.nextProductId,
        ...productAdd,
      };
  
      this.products.push(newProduct);
      this.nextProductId++,
      console.log("Se agregó correctamente el producto");
      return newProduct;
    }
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);

    if (!product) {
       console.log(`no se encontro el id ${productId} solicitado`);
    } else {
       return product
    }
  }
}

const productManager = new ProductManager();

console.log("todos los productos", productManager.getProducts())


productManager.addProducts({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
});
console.log("todos los productos", productManager.getProducts())

productManager.addProducts({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
});

productManager.getProductById(1);