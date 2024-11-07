
// Example of a ProductDAO with basic CRUD operations for products
class ProductDAO {
    constructor(db) {
        this.db = db;
    }

    async getProductById(id) {
        return await this.db.collection('products').findOne({ _id: id });
    }

    async createProduct(productData) {
        return await this.db.collection('products').insertOne(productData);
    }

    async updateProduct(id, updateData) {
        return await this.db.collection('products').updateOne({ _id: id }, { $set: updateData });
    }

    async deleteProduct(id) {
        return await this.db.collection('products').deleteOne({ _id: id });
    }
}

module.exports = ProductDAO;
