const express = require('express');
require('dotenv/config');
require('./db');
const app = express();
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://snippet-manager-test.netlify.app',
    ],
    credentials: true,
  })
);

const usersRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');

app.use(`/users`, usersRouter);
app.use(`/products`, productsRouter);
app.use(`/orders`, ordersRouter);

// for development
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// for production
// app.listen(() => console.log(`Server running`));
