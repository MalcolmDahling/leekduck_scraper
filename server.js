const express = require('express');
const path = require('path');
const { getEvents } = require('./getEvents');

const server = express();
const PORT = 3031;

//update once at startup
getEvents('current');
getEvents('upcoming');

//update every 5 minutes
setInterval(() => {
    getEvents('current');
    getEvents('upcoming');
}, 300000);

let options = {root: path.join(__dirname)};

server.get('/currentEvents', (req, res) => {

    res.sendFile('./output/currentEvents.json', options);
});

server.get('/upcomingEvents', (req, res) => {

    res.sendFile('./output/upcomingEvents.json', options);
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));