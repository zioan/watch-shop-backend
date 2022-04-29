const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// images
router.post('/upload', (req, res) => {
  const newpath = __dirname + '/files/';
  const file = req.files.image;
  const filename = file.name;

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed', code: 200 });
    }
    res.status(200).send({ message: 'File Uploaded', code: 200 });
  });
});

//create product table is not already
router.get('/createproductstable', (req, res) => {
  const sql =
    'CREATE TABLE products(id int AUTO_INCREMENT, name VARCHAR(255), image VARCHAR(255), description VARCHAR(255), price DECIMAL(15,2),  quantity int, timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send('Table already created');
    } else {
      console.log(result);
      res.send('Products table created');
    }
  });
});

// get all products
router.get('/all', (req, res) => {
  const sql = `SELECT * FROM products`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

//create new product
router.post('/add', auth, (req, res) => {
  const newProduct = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  const sql = 'INSERT INTO products set ?';
  const snippet = db.query(sql, newProduct, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      return res.json({ message: 'Product created' });
    }
  });
});

//update product
router.put('/update/:id', auth, (req, res) => {
  const newData = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  const sql = `UPDATE products SET name = '${newData.name}', image = '${newData.image}', description = '${newData.description}', price = '${newData.price}', quantity = ${newData.quantity} WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      return res.json({ message: result });
    }
  });
});

//delete product
router.delete('/delete/:id', auth, (req, res) => {
  const sql = `DELETE from products WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
