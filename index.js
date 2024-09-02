import express from 'express';
const app = express();
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/errors.js';

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR ${err}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})

dotenv.config();

console.log("siavash is back !!!");

// import all routes
import productRoutes from './routes/productRoutes.js';
import authenticationRoutes from './routes/authenticationRoutes.js';
import authenticateToken from './middlewares/authenticateTokenV1.js';

app.use(bodyParser.json());
app.use("/api/v1", productRoutes);
app.use("/api/v1",authenticationRoutes);
app.get('/api/v1/protecteed', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

app.use(errorMiddleware);

const server = app.listen(process.env.PORT,() => {
    console.log(`server is listening on PORT ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promies Rejection");
    server.close(() => {
        process.exit(1);
    });
});