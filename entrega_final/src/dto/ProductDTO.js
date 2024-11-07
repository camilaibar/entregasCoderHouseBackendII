
// Example of a ProductDTO to transform product data for client response
class ProductDTO {
    constructor({ id, name, price, description }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

module.exports = ProductDTO;
