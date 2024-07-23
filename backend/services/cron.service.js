import { scrapeTikiProduct } from "./product.service";
import * as productRepository from "../db/product.repository.js";
import { getEmailNotifType } from "../utils/extractData";
import { generateEmailBody } from "../utils/nodemailer/index.js";

export const cronService = async (products) => {
    try {
        // 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                // Scrape product
                const scrapedProduct = await scrapeTikiProduct(currentProduct.url);

                if (!scrapedProduct) return;

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {
                        price: scrapedProduct.currentPrice,
                    },
                ];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                // Update Products in DB
                const updatedProduct = await productRepository.saveOrUpdate(product.url, product);

                // 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
                const emailNotifType = getEmailNotifType(
                    scrapedProduct,
                    currentProduct
                );

                if (emailNotifType && updatedProduct.users.length > 0) {
                    // Construct emailContent
                    const emailContent = await generateEmailBody(updatedProduct, emailNotifType);
                    // Get array of user emails
                    const userEmails = updatedProduct.users.map((user) => user.email);
                    // Send email notification
                    await sendEmail(emailContent, userEmails);
                }

                return updatedProduct;
            })
        );

        return updatedProducts;
    } catch (error) {
        console.log("Error in cronService service", error);
    }
};