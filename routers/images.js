const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/upload', (req, res) => {
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

module.exports = router;
