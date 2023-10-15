import { IOpenHours } from './common';

interface IService {
  name: string;
  averageTime: number; // В минутах
}

type TQueue = IService[];

export interface IOffice {
  salePointName: string;
  latitude: number;
  longitude: number;
  address: string;
  isWorksAllDay: boolean;
  openHoursLegal: IOpenHours; // Режим работы для юр лиц
  openHoursIndividual: IOpenHours; // Режим работы для физ лиц
  windowsLegal: number;
  windowsIndividual: number;
  windowsIndividualPrivileged: number;
  queueLegal: TQueue;
  queueIndividual: TQueue;
  queueIndividualPrivileged: TQueue;
  servicesListLegal: IService[];
  servicesListIndividual: IService[];
  isLegalServing: boolean;
  isPrivilegedServed?: boolean;
  userDistance?: number;
}
