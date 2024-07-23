
export const clickReviewButton = async (page) => {
    //click and wait for review section to appear
    // await page.waitForSelector(selector);
    // await page.click(selector);
    const selector = '.styles__StyledReview-sc-1onuk2l-1.dRFsZg'; //'selector > a'
    const reviewBtn = await page.$(selector);
    if (!reviewBtn) return false;
    await reviewBtn?.evaluate(btn => btn.click());
    await page.waitForSelector('.review-rating__total');
    return true;
};

export async function scrollPageUntilElement(page, targetSelector, scrollStep = 100, scrollDelay = 100, timeout = 60000) {
    // Custom delay function
    const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        const element = await page.$(targetSelector);
        if (element) {
            return true;
        }

        await page.evaluate(`window.scrollBy(0, ${scrollStep})`);
        // await delay(scrollDelay);

        const newHeight = await page.evaluate('document.body.scrollHeight');
        const currentHeight = await page.evaluate('window.scrollY + window.innerHeight');

        if (currentHeight >= newHeight) {
            break; // Stop scrolling if we've reached the bottom of the page
        }
    }

    console.log(`Element with selector "${targetSelector}" not found within ${timeout}ms`);
    return false;
}