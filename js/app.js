let form = document.querySelector("form");
let marker;
let map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markerIcon = new L.Icon({
  iconUrl: "images/icon-location.svg",
});

form.addEventListener("submit", (e) => {
  let searchInput = document.querySelector("#search__input");
  getDetailsFromIp(searchInput.value);
  e.preventDefault();
});

async function getDetailsFromIp(searchValue) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_uRPjTVs5QHe6xzf5C3DkHfzQ1YYmc&ipAddress=${searchValue}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch IP details");
    }
    const data = await response.json();
    let addressText = document.querySelector(".address__text");
    let locationText = document.querySelector(".location__text");
    let timezoneText = document.querySelector(".timezone__text");
    let ispText = document.querySelector(".isp__text");
    const { ip, location, isp } = data;
    addressText.textContent = ip;
    locationText.textContent = `${location.region},${location.country}`;
    timezoneText.textContent = `UTC${location.timezone}`;
    ispText.textContent = isp;
    setMap(location.lat, location.lng);
  } catch (error) {
    console.error(error);
    // Handle the error and show a message to the user
  }
}

async function geoLocation() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error("Failed to fetch IP address");
    }
    const data = await response.json();
    getDetailsFromIp(data.ip);
  } catch (error) {
    console.error(error);
    // Handle the error and show a message to the user
  }
}

geoLocation();

function setMap(lat, lng) {
  if (marker) {
    map.removeLayer(marker);
  }
  map.setView([lat, lng], 13);
  marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
}
