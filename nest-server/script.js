const fs = require('fs');

// const USER_COORDS = { latitude: 55.6908465, longitude: 37.5595371 };

const rawOfficesData = fs.readFileSync('./data/offices.json', {
  encoding: 'utf-8',
});
const rawAtmsData = fs.readFileSync('./data/atms.json', {
  encoding: 'utf-8',
});

const officesData = JSON.parse(rawOfficesData);
const atmsData = JSON.parse(rawAtmsData);

const INDIVIDUAL_SERVICES_ARRAY = [
  [
    {
      name: 'Оплата счетов и коммунальных услуг',
      averageTime: 7,
    },
    {
      name: 'Выпуск и обслуживание банковских карт (дебетовых и кредитных)',
      averageTime: 4,
    },
    {
      name: 'Потребительские кредиты (на личные нужды)',
      averageTime: 11,
    },
  ],
  [
    {
      name: 'Оплата счетов и коммунальных услуг',
      averageTime: 7,
    },
    {
      name: 'Потребительские кредиты (на личные нужды)',
      averageTime: 11,
    },
  ],
  [
    {
      name: 'Оплата счетов и коммунальных услуг',
      averageTime: 7,
    },
    {
      name: 'Выпуск и обслуживание банковских карт (дебетовых и кредитных)',
      averageTime: 4,
    },
  ],
];

const LEGAL_SERVICES_ARRAY = [
  [
    {
      name: 'Расчетно-кассовое обслуживание',
      averageTime: 15,
    },
    {
      name: 'Документарные операции',
      averageTime: 21,
    },
    {
      name: 'Эквайринг',
      averageTime: 13,
    },
  ],
  [
    {
      name: 'Расчетно-кассовое обслуживание',
      averageTime: 15,
    },
    {
      name: 'Эквайринг',
      averageTime: 13,
    },
  ],
  [
    {
      name: 'Расчетно-кассовое обслуживание',
      averageTime: 15,
    },
  ],
];

const outputOffices = officesData.map((officeData) => {
  const isLegalServing = Math.random() < 0.4;
  const isPrivilegedServed = Math.random < 0.3;

  if (isLegalServing) {
    return {
      isLegalServing,
      isPrivilegedServed,
      servicesListLegal:
        LEGAL_SERVICES_ARRAY[
          Math.floor(Math.random() * LEGAL_SERVICES_ARRAY.length)
        ],
      servicesListIndividual:
        INDIVIDUAL_SERVICES_ARRAY[
          Math.floor(Math.random() * INDIVIDUAL_SERVICES_ARRAY.length)
        ],
      ...officeData,
    };
  }

  return {
    isLegalServing,
    isPrivilegedServed,
    servicesListLegal: [],
    servicesListIndividual:
      INDIVIDUAL_SERVICES_ARRAY[
        Math.floor(Math.random() * INDIVIDUAL_SERVICES_ARRAY.length)
      ],
    ...officeData,
  };
});

const outputAtms = atmsData.map((atmData) => {
  return {
    ...atmData,
  };
});

fs.writeFileSync('offices.json', JSON.stringify(outputOffices, null, 2));
fs.writeFileSync('atms.json', JSON.stringify(outputAtms, null, 2));
