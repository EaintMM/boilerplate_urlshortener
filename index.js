require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const shortid = require('shortid');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const urlDatabase = {};
let shortCode = 0;
// Configure shortid to generate numerical IDs
//shortid.characters('0123456789');

app.use(cors());


app.use('/public', express.static(`${process.cwd()}/public`));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', function(req, res){
  console.log(req.body);
  const longUrl = req.body.url;
  console.log("long url is");
  console.log(longUrl);
  // Validate the URL
  const urlWithoutProtocol = longUrl.replace(/^https?:\/\//, '');
  dns.lookup(urlWithoutProtocol, (err, address) => {
    if (err || !address) {
      res.status(400).json({ error: 'Invalid URL' });
    } else {
      // Generate a unique short code
      //const shortCode = shortid.generate();
 

      // Store the short URL in the database
      urlDatabase[shortCode++] = longUrl;
      console.log(shortCode);

      const shortUrl = `https://3000-freecodecam-boilerplate-gzorpy7fiq0.ws-us110.gitpod.io/${shortCode}`;

      res.json({ 
        "original_url": longUrl,
        "short_url": shortCode 
      });
    }
  });
});

// Your first API endpoint
app.get('/api/shorturl/:shortCode', function(req, res) {
  const shortCode = req.params.shortCode;

  // Check if the short code exists in the database
  if (urlDatabase.hasOwnProperty(shortCode)) {
    // Redirect to the original URL
    res.redirect(urlDatabase[shortCode]);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
