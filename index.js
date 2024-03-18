const axios = require('axios');

const options = {
    method: 'GET',
    url: 'https://uphere-space1.p.rapidapi.com/satellite/20580/location',
    params: {
        lng: '122.374199',
        lat: '47.6484346'
    },
    headers: {
        'X-RapidAPI-Key': 'ed2c503661msh20192ea484d6efcp1c17e0jsnf84f39637d3c',
        'X-RapidAPI-Host': 'uphere-space1.p.rapidapi.com'
    }
};

try {
    const response = await axios.request(options);
    console.log(response.data);
} catch (error) {
    console.error(error);
}