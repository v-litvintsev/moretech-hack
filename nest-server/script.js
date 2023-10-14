const fs = require('fs');

const USER_COORDS = { latitude: 55.6908465, longitude: 37.5595371 };

const rawOfficesData = fs.readFileSync('./nest-server/data/offices.json', {
  encoding: 'utf-8',
});
const rawAtmsData = fs.readFileSync('./nest-server/data/atms.json', {
  encoding: 'utf-8',
});

const officesData = JSON.parse(rawOfficesData);
const atmsData = JSON.parse(rawAtmsData).atms;

const getDistance = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const outputOffices = officesData.map((officesData) => {
  return {
    userDistance: getDistance(
      USER_COORDS.latitude,
      USER_COORDS.longitude,
      officesData.latitude,
      officesData.longitude,
    ),
    ...officesData,
  };
});
const outputAtms = atmsData.map((officesData) => {
  return {
    userDistance: getDistance(
      USER_COORDS.latitude,
      USER_COORDS.longitude,
      officesData.latitude,
      officesData.longitude,
    ),
    ...officesData,
  };
});

outputOffices.length = 20;
outputAtms.length = 200;

fs.writeFileSync('offices.json', JSON.stringify(outputOffices, null, 2));
fs.writeFileSync('atms.json', JSON.stringify(outputAtms, null, 2));
