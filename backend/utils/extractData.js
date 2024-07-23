import { scrollPageUntilElement } from "../puppeteer/pageAction.js";

// Extract data in browsers using puppeteer evaluation
export const extractProductDataInBrowser = async (page) => {
    return await page.evaluate(() => {
        const queryText = (selector) => document.querySelector(selector)?.innerText.trim();
        const queryByAttribute = (selector, attr) => document.querySelector(selector)?.getAttribute(attr);

        const title = queryText('.Title__TitledStyled-sc-c64ni5-0.iXccQY');
        const currentPrice = queryText('.product-price .product-price__current-price');
        const currency = queryText('.product-price .product-price__current-price sup');
        const discountRate = queryText('.product-price .product-price__discount-rate');
        const authorOrBrand = queryText('.brand-and-author a');
        const star = Number(queryText('.styles__StyledReview-sc-1onuk2l-1.dRFsZg div:first-child')) || 0;
        const image = queryByAttribute(".image-frame img", "srcset").split(' ')[0];

        /*reviewCount can select in here but can use 
        in other styles (details below) */

        return { title, currentPrice, discountRate, authorOrBrand, currency, image, star };
    });
};

export async function extractReviewCount(page) {
    const reviewsCountText = await page.$eval('.review-rating__total', e => e.textContent);
    return Number(reviewsCountText.split(' ')[0].substring(1));
}

export function extractPrice(priceText) {
    if (priceText) {
        const price = priceText.replace(/[^\d]/g, '');
        return Number(price);
    }
    return 0;
}

export function extractDiscountRate(discountRateText) {
    // return discountRateText ? Number(discountRateText.replace(/[-%]/g, "")) : 0; //was missing return statement
    if (discountRateText) {
        return Number(discountRateText.replace(/[-%]/g, ""));
    }
    return 0;
}

// Extracts description from several possible elements from tiki
export async function extractDescription(page) {
    const selectors = [
        '.content .ToggleContent__Wrapper-sc-fbuwol-1.xbBes',
        // Add more selectors here if needed
    ];

    for (const selector of selectors) {
        const isFound = await scrollPageUntilElement(page, selector);

        if (isFound) {
            await page.waitForSelector(selector);

            const element = await page.$(selector);
            const description = await page.evaluate(element => element.textContent, element);
            /* comment out description
                        // alternative method
                        // const description = await page.evaluate((selector) => {
                        //     return document.querySelector(selector)?.innerText.trim();
                        // }, selector);
            
                        //clean data
                        // const html = await page.evaluate(element => element.innerHTML, element);
                        // console.log(html);
            
                        //if select all <p> elements
                        // const description = await page.evaluate((selector) => {
                        //     const elements = document.querySelectorAll(selector); //select all elements
                        //     return Array.from(elements).map(p => p.innerText).join('\n\n');
                        // }, selector);
            
                        //if select html and clean on its own
                        // const content = await page.evaluate(() => {
                        //     const container = document.querySelector('.content .ToggleContent__Wrapper-sc-fbuwol-1.xbBes');
                        //     if (!container) return '';
            
                        //     // Remove unwanted tags
                        //     container.querySelectorAll('img, .gradient').forEach(el => el.remove());
            
                        //     // Replace <br> tags with \n
                        //     container.innerHTML = container.innerHTML.replace(/<br\s*\/?>/gi, '\n');
            
                        //     // Get the cleaned text content
                        //     return container.innerText;
                        // });
            
                        // console.log(content);
            */
            return description;
        }
    }

    return "";
}

export function getHighestPrice(priceList) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }

    return highestPrice.price;
}

export function getLowestPrice(priceList) {
    let lowestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }

    return lowestPrice.price;
}

export function getAveragePrice(priceList) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;

    return averagePrice;
}