
// Repository pattern implementation for products
const ProductDAO = require('../dao/ProductDAO');

class ProductRepository {
    constructor(db) {
        this.productDAO = new ProductDAO(db);
    }

    async getProductDetails(id) {
        const product = await this.productDAO.getProductById(id);
        // Implement any additional business logic here if necessary
        return product;
    }

    async addProduct(productData) {
        return await this.productDAO.createProduct(productData);
    }

    async updateProduct(id, updateData) {
        return await this.productDAO.updateProduct(id, updateData);
    }

    async removeProduct(id) {
        return await this.productDAO.deleteProduct(id);
    }
}

module.exports = ProductRepository;
