const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

//env
env.config();

// database connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Database connected'));


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/public',express.static(path.join(__dirname, 'uploads')));
// user route middleware
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port = ${process.env.PORT}`)
});