
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express(),
    port = 3080;

app.use(cors());

let cache = [];

let isRequesting = false;

function waitForRequestToFinish() {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (!isRequesting) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

app.get("/donnees/:req", async (req, res) => {
    const cachedData = cache.find(item => item.info.satid === req.params.req);
    if (cachedData) {
        const secondsPassed = Math.floor((new Date().getTime() - cachedData.info.timestamp) / 1000);
        let cached = JSON.parse(JSON.stringify(cachedData));
        cached.positions = cachedData.positions.slice(secondsPassed, cachedData.positions.length-1);
        console.log("SPLICE EXISTING DATA " + secondsPassed);

        // If the data is older than 295 seconds, delete it and request new data
        if (secondsPassed > 295) {
            console.log("DELETING");
            cache = cache.filter(item => item.info.satid !== req.params.req);
            await waitForRequestToFinish();
            isRequesting = true;
            await fetchData(req.params.req);
            isRequesting = false;
            console.log("SENDING RESPONSE 3");
            res.json(cache.find(item => item.info.satid === req.params.req));
        }
        else {
            console.log("SENDING RESPONSE 1");
            res.json(cached);
        }
    }
    else {
        console.log("NEW REQUEST");
        await waitForRequestToFinish();
        isRequesting = true;
        await fetchData(req.params.req);
        isRequesting = false;
        console.log("SENDING RESPONSE 2");
        res.json(cache.find(item => item.info.satid === req.params.req));
    }
});

async function fetchData(req) {
    try {
        const response = await axios.get(`https://api.n2yo.com/rest/v1/satellite/positions/${req}/0/0/0/300/&apiKey=Q95HV2-VUCS8A-YCRKGZ-571M`);
        const positions = response.data.positions;
        const latitudes = positions.map(position => position.satlatitude);
        const longitudes = positions.map(position => position.satlongitude);
        const timestamp = new Date().getTime();
        const satelliteName = response.data.info.satname;



        const positionsArray = latitudes.map((lat, index) => {
            return {
                satlatitude: lat,
                satlongitude: longitudes[index]
            };
        });

        cache.push({
            info: {
                satname: satelliteName,
                satid: req,
                timestamp: timestamp
            },
            positions: positionsArray
        });

    } catch (error) {
        console.log("ERREUR")
        console.error(error);
    } finally {
        isRequesting = false;
        console.log("FINISHED");
    }
}

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