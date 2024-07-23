import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    authorOrBrand: { type: String, required: true },
    description: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    averagePrice: { type: Number },
    discountRate: { type: Number },
    star: { type: Number },
    reviewsCount: { type: Number },
    priceHistory: [
        {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now() },
        }
    ],
    users: {
        type: [
            { email: { type: String, required: true } }
        ],
        default: [],
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;