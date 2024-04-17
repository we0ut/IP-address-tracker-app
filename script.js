"use strict";

const addressInputEl = document.querySelector(".s-app__address__input");
const ipAddressEl = document.querySelector(".s-app__address__info-text--ip");
const locationEl = document.querySelector(
  ".s-app__address__info-text--location"
);
const timezoneEl = document.querySelector(
  ".s-app__address__info-text--timezone"
);
const ispEl = document.querySelector(".s-app__address__info-text--isp");
const appContainer = document.querySelector(".s-app");
const appContentEl = document.querySelector(".s-app__address");
const appMapEl = document.querySelector(".s-app__map-container");

let map;

window.addEventListener("load", () => {
  const appHeight = appContainer.offsetHeight;
  const contentHeight = appContentEl.offsetHeight;
  const mapHeight = appHeight - contentHeight;
  appMapEl.style.height = `${mapHeight}px`;
});

const fetchGeolocation = async (ipAddress) => {
  const apiKey = "at_94gpy4ZUnVTlGBX1xy0RtktwD6Hxu";
  const apiUrl = `https://geo.ipify.org/api/v1?apiKey=at_94gpy4ZUnVTlGBX1xy0RtktwD6Hxu&ipAddress=${ipAddress}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};

const updateGeolocationInfo = (data) => {
  if (data) {
    ipAddressEl.textContent = data.ip;
    locationEl.textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
    timezoneEl.textContent = `UTC ${data.location.timezone}`;
    ispEl.textContent = data.isp;

    if (!map) {
      const { lat, lng } = data.location;
      map = L.map(appMapEl).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    } else {
      map.setView([data.location.lat, data.location.lng], 13);
    }

    L.marker([data.location.lat, data.location.lng])
      .addTo(map)
      .bindPopup(`${data.location.city}, ${data.location.country}`)
      .openPopup();
  } else {
    alert("Failed to fetch geolocation data.");
  }
};

addressInputEl.parentElement.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ipAddress = addressInputEl.value.trim();
  const geolocationData = await fetchGeolocation(ipAddress);
  updateGeolocationInfo(geolocationData);
});

fetchGeolocation("").then(updateGeolocationInfo);
