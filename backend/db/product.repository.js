import Product from '../models/product.model.js';

export const findProductByUrl = async (url) => {
    return await Product.findOne({ url });
};

export const saveOrUpdate = async (url, product) => {
    return await Product.findOneAndUpdate(
        { url },
        product,
        { upsert: true, new: true },
    );
};

export const findAll = async () => {
    return await Product.find();
};

export const findById = async (productId) => {
    return await Product.findOne({ _id: productId });
};

export const findByProductId = async (productId) => {
    return await Product.findById(productId);
};

export const findProductsNotEqualId = async (productId) => {
    return await Product.find({
        _id: { $ne: productId }
    }).limit(3);
};

export const findUserExistsInProductByEmail = (product, email) => {
    return product.users.some(user => user.email === email);
};

export const updateUserToProduct = async (product, email) => {
    product.users.push({ email: email });
    return await product.save();
};