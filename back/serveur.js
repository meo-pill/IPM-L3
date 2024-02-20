const express = require('express');
const cors = require('cors');
const app = express(),
    port = 3080;

app.use(cors());

app.get("/donnees", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("aaaaaaaaaaaaa" + port)
});