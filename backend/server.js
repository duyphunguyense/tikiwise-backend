import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectToDB } from "./db/mongoose.js";
import productRoute from "./routes/product.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors());
app.use(express.json());//to parse the incoming requests with JSON payload (from req.body)
app.use(cookieParser());

app.use('/api/product', productRoute);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server running on port ${PORT}`);
});