import { cronService } from "../services/cron.service.js";
import {
    saveOrUpdateProduct,
    scrapeTikiProduct,
    getAllProductsService,
    getProductByIdService,
    getSimilarProductsService,
    addUserEmailToProductService
} from "../services/product.service.js";

export const cron = async (req, res) => {
    try {
        const products = await getAllProductsService();

        if (!products) throw new Error("No product fetched");

        const updatedProducts = await cronService(products);

        return res.status(200).json({
            message: "Ok",
            data: updatedProducts,
        });
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};