import express from "express";
const app = express();
const port = 3000;

const hogfe = 9;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
