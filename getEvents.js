const { default: puppeteer } = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function getEvents(eventType) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('Scraping...');

  try {
    await page.goto('https://leekduck.com/events/', { waitUntil: 'domcontentloaded' });
  } catch (err) {
    console.log(err);
  }

  let events = [];

  try {
    events = await page.evaluate((eventType) => {
      return Array.from(document.querySelectorAll(`${eventType === 'current' ? '.events-section-live' : '.events-section-upcoming'} .event-item-link:not(.hide-event)`), (el) => {
        const url = el.href;
        const type = el.querySelector('div > p')?.textContent.trim();
        const name = el.querySelector('div > div > div > .event-text > h2')?.textContent.trim();
        const date = el.querySelector('div > div > div > .event-text > p')?.textContent.trim();
        const endsOrStarts = el.querySelector('div > div > div > .event-countdown-container > div > div')?.textContent.trim().replace(':', '');
        const endsOrStartsTime = el
          .querySelector('div > div > div > .event-countdown-container > div')
          ?.textContent.replace('Ends:', '')
          .replace('Starts:', '')
          .replace(/\s{2,}/g, ' ')
          .trim();
        const image = el.querySelector('.event-img-wrapper > img')?.src.trim();
        const color = window.getComputedStyle(el.querySelector('.event-img-wrapper')).backgroundColor;
        return { url, type, name, date, endsOrStarts, endsOrStartsTime, image, color };
      });
    }, eventType);
  } catch (err) {
    console.log(err);
  }

  console.log('Event type:', eventType, '\nEvents:', events);

  const filePath = path.join(__dirname, 'output', `./${eventType}Events.json`);
  if (events.length > 0) {
    fs.writeFile(filePath, JSON.stringify(events, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  await browser.close();
}

module.exports = {
  getEvents,
};
