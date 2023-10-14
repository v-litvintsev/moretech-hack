import { IOpenHoursItem } from './common';

interface IService {
  name: string;
  averageTime: number; // В минутах
}

interface IQueue {
  services: IService[];
}

export interface IOffice {
  salePointName: string;
  latitude: number;
  longitude: number;
  address: string;
  isWorksAllDay: boolean;
  openHoursForLegal: IOpenHoursItem[]; // Режим работы для юр лиц
  openHoursForIndividual: IOpenHoursItem[]; // Режим работы для физ лиц
  windowsLegal: number;
  windowsIndividual: number;
  windowsIndividualPrivileged: number;
  queueLegal: IQueue;
  queueIndividual: IQueue;
  queueIndividualPrivileged: IQueue;
  servicesListLegal: IService[];
  servicesListIndividual: IService[];
  isLegalServing: boolean;
  isPrivilegedServed?: boolean;
}
