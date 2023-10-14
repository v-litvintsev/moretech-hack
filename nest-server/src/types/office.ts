import { IOpenHoursItem } from './common';

interface IService {
  name: string;
  averageTime: number; // В минутах
}

interface IQueue {
  legals: IService[];
  individuals: IService[];
}

export interface IOffice {
  pointName: string;
  latitude: number;
  longitude: number;
  address: string;
  isWorksAllDay: boolean;
  openHoursForLegal: IOpenHoursItem[]; // Режим работы для юр лиц
  openHoursForIndividual: IOpenHoursItem[]; // Режим работы для физ лиц
  queue: IQueue;
  servicesListLegal: IService[];
  servicesListIndividual: IService[];
}
