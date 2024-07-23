import express from 'express';
import { cron } from '../controllers/cron.controller';

const router = express.Router();

router.get('/', cron);

export default router;