import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const url = "https://api.wheretheiss.at/v1/satellites/25544";

  https.get(url, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const result = JSON.parse(data);
        res.render("index", { result });
      } catch (error) {
        console.error("JSON parsing error:", error);
        res.status(500).send("Failed to fetch or parse data");
      }
    });

  }).on('error', (err) => {
    console.error("Request error:", err);
    res.status(500).send("Failed to fetch data from API");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
