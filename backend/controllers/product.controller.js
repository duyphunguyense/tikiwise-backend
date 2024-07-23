import {
    saveOrUpdateProduct,
    scrapeTikiProduct,
    getAllProductsService,
    getProductByIdService,
    getSimilarProductsService,
    addUserEmailToProductService
} from "../services/product.service.js";

export const scrapeProductController = async (req, res) => {
    try {
        const { url } = req.body;
        // const options = configBrightData();O

        // const response = await axios.get(url, options);
        // console.log(response);

        //scrapeProduct
        const scrapedProduct = await scrapeTikiProduct(url);

        if (!scrapedProduct) return res.status(404).send("Bad request");

        //store data in database
        const product = await saveOrUpdateProduct(scrapedProduct);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getProductByIdService(productId);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

export const getSimilarProducts = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await getSimilarProductsService(productId);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

export const addUserEmailToProduct = async (req, res) => {
    try {
        const { productId, userEmail } = req.body;

        const product = await addUserEmailToProductService(productId, userEmail);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};