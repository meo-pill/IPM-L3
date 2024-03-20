
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express(),
    port = 3080;

app.use(cors());

app.get("/donnees/:req", async (req, res) => {
    try {
    const response = await axios.get(`https://api.n2yo.com/rest/v1/satellite/positions/${req.params.req}/0/0/0/300/&apiKey=Q95HV2-VUCS8A-YCRKGZ-571M`)
    res.json(response.data)
    } catch (error) {res.json({name: ""})}
});

app.get("/infos/:req", async (req, res) => {
    try {
    const response = await axios.get(`https://db.satnogs.org/api/satellites/${req.params.req}/?format=json`)
    res.json(response.data)
    } catch (error) {res.json({name: ""})}
});

app.get("/satellite/:id", async (req, res) => {
    try {
        const response = await axios.get(`https://db.satnogs.org/satellite/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        res.send({name: ""});
    }
});

app.listen(port, () => {
    console.log("Serveur ouvert sur le port " + port)
});