const fs = require('fs');

const rawOfficesData = fs.readFileSync('./data/offices.json', {
  encoding: 'utf-8',
});

const officesData = JSON.parse(rawOfficesData);

const outputOffices = officesData.map((officeData) => {
  return {
    ...officeData,
  };
});

fs.writeFileSync('offices.json', JSON.stringify(outputOffices, null, 2));
