/**
 * airlines.js
 * Airline check-in window data and deep-link URL templates.
 * PNR and last name are injected at runtime via {PNR} and {LAST} tokens.
 *
 * To add an airline:
 *   1. Add an entry to the AIRLINES object below.
 *   2. Add a matching <option> in the index.html <select>.
 *
 * Fields:
 *   windowHrs  – how many hours before departure check-in opens
 *   baseUrl    – homepage of the airline's check-in flow
 *   deepUrl    – URL with {PNR} and {LAST} placeholders (pre-fills the form)
 *   note       – optional pro-tip shown in the agent UI
 */

const AIRLINES = {
  "American Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.aa.com/checkin",
    deepUrl: "https://www.aa.com/checkin?confirmationNumber={PNR}&lastName={LAST}",
  },
  "Delta Air Lines": {
    windowHrs: 24,
    baseUrl: "https://www.delta.com/us/en/check-in/overview",
    deepUrl: "https://www.delta.com/us/en/check-in/overview?confirmationNumber={PNR}&lastName={LAST}",
  },
  "United Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.united.com/ual/en/us/flight-search/book-a-flight/checkin.html",
    deepUrl: "https://www.united.com/ual/en/us/flight-search/book-a-flight/checkin.html?PNR={PNR}&lastName={LAST}",
  },
  "Southwest Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.southwest.com/air/check-in/",
    deepUrl: "https://www.southwest.com/air/check-in/?confirmationNumber={PNR}&lastName={LAST}",
    note: "Southwest boards by group (A/B/C). Log in exactly at T-24h for the best position.",
  },
  "Alaska Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.alaskaair.com/web/check-in",
    deepUrl: "https://www.alaskaair.com/web/check-in",
  },
  "JetBlue": {
    windowHrs: 24,
    baseUrl: "https://www.jetblue.com/trueblue/check-in",
    deepUrl: "https://www.jetblue.com/trueblue/check-in",
  },
  "Spirit Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.spirit.com/CheckIn",
    deepUrl: "https://www.spirit.com/CheckIn",
  },
  "Frontier Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.flyfrontier.com/travel/my-trip/check-in/",
    deepUrl: "https://www.flyfrontier.com/travel/my-trip/check-in/",
  },
  "British Airways": {
    windowHrs: 24,
    baseUrl: "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_gb",
    deepUrl: "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_gb",
  },
  "Emirates": {
    windowHrs: 48,
    baseUrl: "https://www.emirates.com/us/english/manage-booking/check-in/",
    deepUrl: "https://www.emirates.com/us/english/manage-booking/check-in/",
    note: "Emirates opens check-in 48 hours before departure.",
  },
  "Lufthansa": {
    windowHrs: 23,
    baseUrl: "https://www.lufthansa.com/us/en/online-check-in",
    deepUrl: "https://www.lufthansa.com/us/en/online-check-in",
    note: "Lufthansa opens check-in 23 hours before (not 24).",
  },
  "Air France": {
    windowHrs: 30,
    baseUrl: "https://www.airfrance.com/en/information/checkin/online-check-in",
    deepUrl: "https://www.airfrance.com/en/information/checkin/online-check-in",
    note: "Air France opens check-in 30 hours before departure.",
  },
  "Singapore Airlines": {
    windowHrs: 48,
    baseUrl: "https://www.singaporeair.com/en_UK/us/manage-booking/check-in/",
    deepUrl: "https://www.singaporeair.com/en_UK/us/manage-booking/check-in/",
    note: "Singapore Airlines opens check-in 48 hours before departure.",
  },
  "Qatar Airways": {
    windowHrs: 24,
    baseUrl: "https://www.qatarairways.com/en-us/checkin.html",
    deepUrl: "https://www.qatarairways.com/en-us/checkin.html",
  },
  "Turkish Airlines": {
    windowHrs: 24,
    baseUrl: "https://www.turkishairlines.com/en-us/flights/manage-booking/check-in/",
    deepUrl: "https://www.turkishairlines.com/en-us/flights/manage-booking/check-in/",
  },
  "KLM": {
    windowHrs: 24,
    baseUrl: "https://www.klm.com/us/en/manage-booking/check-in",
    deepUrl: "https://www.klm.com/us/en/manage-booking/check-in",
  },
  "Ryanair": {
    windowHrs: 24,
    baseUrl: "https://www.ryanair.com/gb/en/check-in",
    deepUrl: "https://www.ryanair.com/gb/en/check-in",
  },
  "EasyJet": {
    windowHrs: 24,
    baseUrl: "https://www.easyjet.com/en/check-in",
    deepUrl: "https://www.easyjet.com/en/check-in",
  },
  "IndiGo": {
    windowHrs: 48,
    baseUrl: "https://www.goindigo.in/check-in.html",
    deepUrl: "https://www.goindigo.in/check-in.html",
    note: "IndiGo opens check-in 48 hours before departure.",
  },
  "Air India": {
    windowHrs: 48,
    baseUrl: "https://www.airindia.com/check-in.htm",
    deepUrl: "https://www.airindia.com/check-in.htm",
    note: "Air India opens check-in 48 hours before departure.",
  },
  "Other": {
    windowHrs: 24,
    baseUrl: "https://www.google.com/search?q=online+check+in",
    deepUrl: "https://www.google.com/search?q=online+check+in",
  },
};
