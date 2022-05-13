const express = require('express');
require('dotenv/config');
require('./db');
const app = express();
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(morgan('tiny'));
app.use(fileUpload());

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shop.zioan.com'],
    credentials: true,
  })
);

const usersRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const imagesRouter = require('./routers/images');

app.use(`/users`, usersRouter);
app.use(`/products`, productsRouter);
app.use(`/orders`, ordersRouter);
app.use(`/images`, imagesRouter);
app.use(`/files`, express.static(`routers/files`));

// for development
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// for production
app.listen(() => console.log(`Server running`));
