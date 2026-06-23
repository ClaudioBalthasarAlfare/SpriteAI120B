'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer to store uploaded files in the uploads directory
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Only accept .zip files
const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/x-zip-compressed' ||
    path.extname(file.originalname).toLowerCase() === '.zip'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .zip files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Serve the static HTML page
app.use(express.static(path.join(__dirname, 'public')));

// POST /upload — accepts a single .zip file
app.post('/upload', upload.single('zipfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file is not a .zip archive.' });
  }
  res.json({
    message: 'File uploaded successfully.',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
  });
});

// Error handler for multer and other errors
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'Upload failed.' });
  }
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
