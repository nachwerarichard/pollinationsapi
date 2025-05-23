const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = 3001;

app.post('/api/generate-html', upload.single('image'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('email', 'nachwerarichard@gmail.com');
    formData.append('api_key', 'ae111f741e9f356d1726d33c1014188a'); // Keep this secure
    formData.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post('https://api.img2html.com/api/generate-html', formData, {
      headers: formData.getHeaders()
    });

    fs.unlink(req.file.path, () => {}); // cleanup uploaded file

    res.json(response.data); // Send back HTML
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate HTML' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
