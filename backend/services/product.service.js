import puppeteer from "puppeteer";
import * as productRepository from "../db/product.repository.js";
import { clickReviewButton } from "../puppeteer/pageAction.js";
import * as extractData from "../utils/extractData.js";
import { generateEmailBody, sendEmail } from "../utils/nodemailer/index.js";

export const scrapeTikiProduct = async (url) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.goto(url);

        // page.on('console', msg => console.log('PAGE LOG:', msg.text())); //debugger
        const data = await extractData.extractProductDataInBrowser(page);
        const currentPrice = extractData.extractPrice(data.currentPrice);
        const discountRate = extractData.extractDiscountRate(data.discountRate);
        const description = await extractData.extractDescription(page); //scroll and wait for element appears and extract description

        const isClicked = await clickReviewButton(page);
        let reviewsCount = 0;
        if (isClicked) {
            reviewsCount = await extractData.extractReviewCount(page);
        }

        const product = {
            ...data,
            currentPrice,
            discountRate,
            url,
            reviewsCount,
            description,
            originalPrice: currentPrice,
            lowestPrice: currentPrice,
            highestPrice: currentPrice,
            averagePrice: currentPrice,
            priceHistory: [],
        };

        return product;
    } catch (error) {
        console.log("Error in scrapeTikiProduct service", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export const saveOrUpdateProduct = async (scrapedProduct) => {
    try {
        let product = scrapedProduct;

        const existingProduct = await productRepository.findProductByUrl(scrapedProduct.url);

        if (existingProduct) {
            const updatedPriceHistory = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice },
            ];

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: extractData.getLowestPrice(updatedPriceHistory),
                highestPrice: extractData.getHighestPrice(updatedPriceHistory),
                averagePrice: extractData.getAveragePrice(updatedPriceHistory),
            };
        }

        const newProduct = await productRepository.saveOrUpdate(scrapedProduct.url, product);

        return newProduct;
    } catch (error) {
        console.log("Error in saveOrUpdateProduct service", error);
    }
};

export const getAllProductsService = async () => {
    try {
        const allProducts = await productRepository.findAll();

        return allProducts;
    } catch (error) {
        console.log("Error in getAllProductsService service", error);
    }
};

export const getProductByIdService = async (productId) => {
    try {
        return await productRepository.findById(productId);
    } catch (error) {
        console.log("Error in getProductByIdService service", error);
    }
};

export const getSimilarProductsService = async (productId) => {
    try {
        const currentProduct = await productRepository.findByProductId(productId);

        if (!currentProduct) return null;

        const products = await productRepository.findProductsNotEqualId(productId);

        return products;
    } catch (error) {
        console.log("Error in getSimilarProductsService service", error);
    }
};

export const addUserEmailToProductService = async (productId, userEmail) => {
    try {
        const currentProduct = await productRepository.findByProductId(productId);

        if (!currentProduct) return null;

        const userExists = await productRepository.findUserExistsInProductByEmail(currentProduct, userEmail);

        let updatedProduct = currentProduct;
        if (!userExists) {
            updatedProduct = await productRepository.updateUserToProduct(currentProduct, userEmail);

            //send email notification
            const emailContent = await generateEmailBody(currentProduct, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }

        return updatedProduct;
    } catch (error) {
        console.log("Error in addUserEmailToProductService service", error);
    }
};