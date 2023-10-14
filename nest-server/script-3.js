const fs = require('fs');

const rawOfficesData = fs.readFileSync('./data/offices.json', {
  encoding: 'utf-8',
});

const officesData = JSON.parse(rawOfficesData);

const OPEN_HOURS_EXAMPLES = [
  {
    workingDays: {
      start: 10,
      end: 20,
      averageTraffic: {
        10: 4,
        11: 5,
        12: 6,
        13: 7,
        14: 8,
        15: 8,
        16: 9,
        17: 9,
        18: 10,
        19: 9,
        20: 8,
      },
    },
    weekends: {
      start: 10,
      end: 10,
      averageTraffic: {},
    },
  },
  {
    workingDays: {
      start: 10,
      end: 16,
      averageTraffic: {
        10: 4,
        11: 5,
        12: 6,
        13: 7,
        14: 8,
        15: 8,
        16: 9,
      },
    },
    weekends: {
      start: 10,
      end: 10,
      averageTraffic: {},
    },
  },
  {
    workingDays: {
      start: 0,
      end: 24,
      averageTraffic: {
        0: 1,
        1: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 2,
        6: 2,
        7: 2,
        8: 3,
        9: 3,
        10: 4,
        11: 5,
        12: 6,
        13: 7,
        14: 8,
        15: 8,
        16: 9,
        17: 9,
        18: 10,
        19: 9,
        20: 8,
        21: 7,
        22: 5,
        23: 3,
        24: 1,
      },
    },
    weekends: {
      start: 0,
      end: 24,
      averageTraffic: {
        0: 1,
        1: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 2,
        6: 2,
        7: 2,
        8: 3,
        9: 3,
        10: 4,
        11: 5,
        12: 6,
        13: 7,
        14: 8,
        15: 8,
        16: 9,
        17: 9,
        18: 10,
        19: 9,
        20: 8,
        21: 7,
        22: 5,
        23: 3,
        24: 1,
      },
    },
  },
];

const outputOffices = officesData.map((officeData) => {
  const openHoursIndividual =
    OPEN_HOURS_EXAMPLES[Math.floor(Math.random() * OPEN_HOURS_EXAMPLES.length)];

  if (officeData.isLegalServing) {
    return {
      ...officeData,
      openHoursIndividual,
      openHoursLegal: openHoursIndividual,
    };
  }

  return {
    ...officeData,
    openHoursIndividual,
    openHoursLegal: {},
  };
});

fs.writeFileSync('offices.json', JSON.stringify(outputOffices, null, 2));
