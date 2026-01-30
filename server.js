const express = require('express');
const path = require('path');
const { getEvents } = require('./getEvents');
const cors = require('cors');

const server = express();
server.use(
  cors({
    origin: '*',
  }),
);
const PORT = 3032;

//update once at startup
getEvents('current');
getEvents('upcoming');

//update every 30-35 minutes
setInterval(() => {
  //random delay 2-5 min. this can overlap with the interval
  const delayMs = Math.random() * (5 * 60_000 - 2 * 60_000) + 2 * 60_000;

  setTimeout(() => {
    getEvents('current');
    getEvents('upcoming');
  }, delayMs);
}, 1800000);

let options = { root: path.join(__dirname) };

server.get('/currentEvents', (req, res) => {
  res.sendFile('./output/currentEvents.json', options);
});

server.get('/upcomingEvents', (req, res) => {
  res.sendFile('./output/upcomingEvents.json', options);
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
