"use strict";

const addressInputEl = document.querySelector(".s-app__address__input");

const loadMap = (position) => {
  console.log(position);
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const coords = [latitude, longitude];
  let map = L.map("s-app__map").setView(coords, 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
};

const getPosition = () => {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(loadMap, function () {
      alert("Could not get your position");
    });
};
getPosition();
