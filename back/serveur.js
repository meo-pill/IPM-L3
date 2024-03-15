const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express(),
    port = 3080;

app.use(cors());

app.get("/donnees/:req", async (req, res) => {
    const response = await axios.get(`https://api.n2yo.com/rest/v1/satellite/positions/${req.params.req}/0/0/0/300/&apiKey=Q95HV2-VUCS8A-YCRKGZ-571M`)
    res.json(response.data)
});

app.listen(port, () => {
    console.log("Serveur ouvert sur le port " + port)
});