const express = require('express');
const bodyParser = require('body-parser');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
