import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';



const app = express();
const PORT = process.env.PORT || 5000;
connectDB(); // Connect to MongoDB

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin here
  credentials: true, // allow cookies and credentials
}));

// Routes: API endpoints
app.get('/', (req, res) => { 
    res.send('API...');
});
app.use('/api/auth', authRouter); // Authentication routes
app.use('/api/user', userRouter); // User routes
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
