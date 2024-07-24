import express from 'express';
import { cron } from '../controllers/cron.controller.js';

const router = express.Router();

router.get('/', cron);

export default router;