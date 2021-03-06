const errorLabel = document.querySelector("label[for='error-msg']");
const latInp = document.querySelector("#latitude");
const lonInp = document.querySelector("#longitude");
const airQuality = document.querySelector(".air-quality");
const airQualityStat = document.querySelector(".air-quality-status");
const srchBtn = document.querySelector(".search-btn");
const componentsEle = document.querySelectorAll(".component-val");
const componentsPred = document.querySelectorAll(".component-pred");

const appId = "2d3a228abd6efc850e7de37037b03f2d";


const getUserLocation = () => {
  // Get user Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      onPositionGathered,
      onPositionGatherError
    );
  } else {
    onPositionGatherError({
      message: "Can't Access your location. Please enter your co-ordinates",
    });
  }
};

const onPositionGathered = (pos) => {
  let lat = pos.coords.latitude.toFixed(4),
    lon = pos.coords.longitude.toFixed(4);


  latInp.value = lat;
  lonInp.value = lon;


  getAirQuality(lat, lon);
  getAirQualityPrediction(lat, lon)
};

const getAirQuality = async (lat, lon) => {

  const rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${appId}`
  ).catch((err) => {
    onPositionGatherError({
      message: "Something went wrong. Check your internet conection.",
    });
    console.log(err);
  });
  console.log(rawData);
  const airData = await rawData.json();
  setValuesOfAir(airData);
  setComponentsOfAir(airData);
};

const getAirQualityPrediction = async (lat, lon) => {

  const rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${appId}`
  ).catch((err) => {
    onPositionGatherError({
      message: "Something went wrong. Check your internet conection.",
    });
    console.log(err);
  });
  console.log(rawData);
  const airForecastData = await rawData.json();
  setComponentsOfForecastAir(airForecastData);
};

const setValuesOfAir = (airData) => {
  const aqi = airData.list[0].main.aqi;
  let airStat = "",
    color = "";


  airQuality.innerText = aqi;



  switch (aqi) {
    case 1:
      airStat = "Sehat";
      color = "rgb(19, 201, 28)";
      break;
    case 2:
      airStat = "Baik";
      color = "rgb(15, 134, 25)";
      break;
    case 3:
      airStat = "Tidak Sehat";
      color = "rgb(201, 204, 13)";
      break;
    case 4:
      airStat = "Sangat Tidak Sehat";
      color = "rgb(204, 83, 13)";
      break;
    case 5:
      airStat = "Berbahaya";
      color = "rgb(204, 13, 13)";
      break;
    default:
      airStat = "Unknown";
  }

  airQualityStat.innerText = airStat;
  airQualityStat.style.color = color;
};

const setComponentsOfAir = (airData) => {
  let components = { ...airData.list[0].components };
  componentsEle.forEach((ele) => {
    const attr = ele.getAttribute("data-comp");
    ele.innerText = components[attr] += " ??g/m??";
  });
};

const setComponentsOfForecastAir = (airForecastData) => {
  let pred_components = { ...airForecastData.list[24].components };
  componentsPred.forEach((ele) => {
    const attr = ele.getAttribute("data-comp-pred");
    ele.innerText = pred_components[attr] += " ??g/m??";
  });
};

const onPositionGatherError = (e) => {
  errorLabel.innerText = e.message;
};

srchBtn.addEventListener("click", () => {
  getAirQuality(
    parseFloat(latInp.value).toFixed(4),
    parseFloat(lonInp.value).toFixed(4)
  );
});

getUserLocation();
