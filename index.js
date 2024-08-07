import express from 'express';
const app = express();
import dotenv from 'dotenv';

dotenv.config();

// import all routes
import productRoutes from './routes/productRoutes.js';

app.use("/api/v1", productRoutes);

app.listen(process.env.PORT,() => {
    console.log(`server is listening on PORT ${process.env.PORT} in ${process.env.NODE_ENV}`);
});