import express from 'express';
import {
    scrapeProductController,
    getAllProducts,
    getProductById,
    getSimilarProducts,
    addUserEmailToProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/scrape', scrapeProductController);
router.get('/trending', getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/similar', getSimilarProducts);
router.post('/email/user', addUserEmailToProduct);

export default router;