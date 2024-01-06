const { default: puppeteer } = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function getEvents(eventType) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://leekduck.com/events/', { waitUntil: 'domcontentloaded' });
  } catch (err) {
    console.log(err);
  }

  let events;

  if (eventType === 'current') {
    try {
      events = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('body > div > article > div > div > div.events-list.current-events > span > a:not(.hide-event)'), (el) => el.textContent.replace(/\t|\n/g, '').split('   '));
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (eventType === 'upcoming') {
    try {
      events = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('body > div > article > div > div > div.events-list.upcoming-events > span > a:not(.hide-event)'), (el) => el.textContent.replace(/\t|\n/g, '').split('   '));
      });
    } catch (err) {
      console.log(err);
    }
  }

  //remove empty entries
  events = events.map((subArr) => subArr.filter((str) => str.trim() !== ''));

  //remove spaces at the start of the strings
  events = events.map((subArr) => subArr.map((str) => str.trim()));

  //remove double spaces
  events = events.map((arr) => arr.map((str) => str.replace(/\s{2,}/g, ' ').trim()));

  //turn into objects
  events = events.map((event) => {
    return {
      type: event[0],
      name: event[1],
      date: event[2],
      endsOrStarts: event[3],
      color: '',
      img: '',
      url: '',
    };
  });

  if (eventType === 'current') {
    try {
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(`body > div > article > div > div > div.events-list.current-events > span > a:not(.hide-event) > div > div.event-item > span > img`), (el) => el.src);
      });

      const colors = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('body > div > article > div > div > div.events-list.current-events > span > a:not(.hide-event) > div'), (el) => el);

        let styles = elements.map((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        return styles;
      });

      const urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(`body > div > article > div > div > div.events-list.current-events > span > a:not(.hide-event)`), (el) => el.href);
      });

      for (let i = 0; i < events.length; i++) {
        events[i].img = images[i];
        events[i].color = colors[i];
        events[i].url = urls[i];
      }

      const filePath = path.join(__dirname, 'output', './currentEvents.json');

      if (events.length > 0) {
        fs.writeFile(filePath, JSON.stringify(events, null, 2), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (eventType === 'upcoming') {
    try {
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(`body > div > article > div > div > div.events-list.upcoming-events > span > a:not(.hide-event) > div > div.event-item > span > img`), (el) => el.src);
      });

      const colors = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('body > div > article > div > div > div.events-list.upcoming-events > span > a:not(.hide-event) > div'), (el) => el);

        let styles = elements.map((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        return styles;
      });

      const urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(`body > div > article > div > div > div.events-list.upcoming-events > span > a:not(.hide-event)`), (el) => el.href);
      });

      for (let i = 0; i < events.length; i++) {
        events[i].img = images[i];
        events[i].color = colors[i];
        events[i].url = urls[i];
      }

      const filePath = path.join(__dirname, 'output', './upcomingEvents.json');

      if (events.length > 0) {
        fs.writeFile(filePath, JSON.stringify(events, null, 2), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  await browser.close();
}

module.exports = {
  getEvents,
};
