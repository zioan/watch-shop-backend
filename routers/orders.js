const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

//create table is not already
router.get('/createorderstable', (req, res) => {
  const sql =
    'CREATE TABLE orders(id int AUTO_INCREMENT, user_id VARCHAR(255), product_id VARCHAR(255), status VARCHAR(255), quantity int, price DECIMAL(15,2), timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send('Table already created');
    } else {
      console.log(result);
      res.send('Orders table created');
    }
  });
});

// get all user orders
router.get('/all/:user_id', auth, (req, res) => {
  const sql = `SELECT * FROM orders WHERE user_id = "${req.params.user_id}"`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

// get all orders
router.get('/all', auth, (req, res) => {
  const sql = `SELECT * FROM orders`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

// filter orders by status
router.get('/all/:status', auth, (req, res) => {
  const sql = `SELECT * FROM orders WHERE status = ${req.params.status}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

//create new order
router.post('/add', auth, (req, res) => {
  const newOrder = {
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    status: req.body.status,
    quantity: req.body.quantity,
    price: req.body.price,
  };

  const sql = 'INSERT INTO orders set ?';
  const snippet = db.query(sql, newOrder, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      console.log(result);
      return res.json({ message: 'Order placed' });
    }
  });
});

//update order status
router.put('/update/:id', auth, (req, res) => {
  const newStatus = {
    status: req.body.status,
  };

  const sql = `UPDATE orders SET status = '${newStatus.status}' WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      return res.json({ message: result });
    }
  });
});

//delete order
router.post('/delete/:id', auth, (req, res) => {
  const sql = `DELETE from orders WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

module.exports = router;
