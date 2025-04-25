const express = require("express");
const app = express();
const path = require("path");

const PORT = 3000;
const CORRECT_PASSWORD = "ahmad123"; 

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/check-password", (req, res) => {
  const { password } = req.body;
  if (password === CORRECT_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
