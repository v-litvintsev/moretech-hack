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

const INDIVIDUAL_SERVICES = [
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
];

const LEGAL_SERVICES = [
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
];

const outputOffices = officesData.map((officeData) => {
  const isLegalServing = Math.random() < 0.4;
  const isPrivilegedServed = Math.random() < 0.3;

  const windowsIndividual = 3 + Math.floor(Math.random() * 3);
  const queueIndividual = Array(Math.floor(Math.random() * 15))
    .fill(null)
    .map(
      () =>
        INDIVIDUAL_SERVICES[
          Math.floor(Math.random() * INDIVIDUAL_SERVICES.length)
        ],
    );

  if (isLegalServing) {
    const windowsLegal = 1 + Math.floor(Math.random() * 1);
    const queueLegal = Array(Math.floor(Math.random() * 8))
      .fill(null)
      .map(
        () => LEGAL_SERVICES[Math.floor(Math.random() * LEGAL_SERVICES.length)],
      );

    return {
      ...officeData,
      windowsIndividual,
      windowsLegal,
      queueIndividual,
      queueIndividualPrivileged: [],
      queueLegal,
      isLegalServing,
      isPrivilegedServed,
    };
  }

  if (isPrivilegedServed) {
    return {
      ...officeData,
      windowsIndividual,
      windowsLegal: 0,
      queueIndividual,
      queueIndividualPrivileged: [],
      queueLegal: [],
      isLegalServing,
      isPrivilegedServed,
    };
  }

  return {
    ...officeData,
    windowsIndividual,
    windowsLegal: 0,
    queueIndividual,
    queueIndividualPrivileged: [],
    queueLegal: [],
    isLegalServing,
    isPrivilegedServed,
  };
});

const outputAtms = atmsData.map((atmData) => {
  return {
    ...atmData,
  };
});

fs.writeFileSync('offices.json', JSON.stringify(outputOffices, null, 2));
fs.writeFileSync('atms.json', JSON.stringify(outputAtms, null, 2));
