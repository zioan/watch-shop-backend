const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const fs = require('fs');

//create table is not already
router.get('/createimagestable', (req, res) => {
  const sql =
    'CREATE TABLE images(id int AUTO_INCREMENT, name VARCHAR(255), timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send('Table already created');
    } else {
      console.log(result);
      res.send('Images table created');
    }
  });
});

//get all images (names) from DB
router.get('/all', auth, (req, res) => {
  const sql = `SELECT * FROM images`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      res.send(result);
    }
  });
});

// save image name in DB
router.post('/add', auth, (req, res) => {
  const newImage = {
    name: req.body.name,
  };

  const sql = 'INSERT INTO images set ?';
  const snippet = db.query(sql, newImage, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      console.log(result);
      return res.json({ message: 'Image uploaded' });
    }
  });
});

// upload image to static folder
router.post('/upload', auth, (req, res) => {
  const newpath = __dirname + '/files/';
  const file = req.files.file;
  const filename = file.name;

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed', code: 200 });
    }
    res.status(200).send({ message: 'File Uploaded', code: 200 });
  });
});

//delete image from DB
router.delete('/delete/:id', auth, (req, res) => {
  const sql = `DELETE from images WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: err });
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// delete image from static folder
router.delete('/remove/:name', async (req, res) => {
  try {
    fs.unlinkSync(`./routers/files/${req.params.name}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
