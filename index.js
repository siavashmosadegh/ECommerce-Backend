import express from 'express';
const app = express();
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/errors.js';

dotenv.config();


// import all routes
import productRoutes from './routes/productRoutes.js';

app.use(bodyParser.json());
app.use("/api/v1", productRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT,() => {
    console.log(`server is listening on PORT ${process.env.PORT} in ${process.env.NODE_ENV}`);
});