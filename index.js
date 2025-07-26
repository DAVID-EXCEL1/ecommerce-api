const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
dotenv.config();
const { errorHandler } = require('./middleware/errorMiddleware');

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('API is running...');
});
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes); // Or wherever appropriate

app.use(errorHandler);

const PORT = process.env.PORT || 5000;    
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
