import { IOpenHours } from './common';

interface IAtmService {
  serviceCapability: 'UNKNOWN' | 'SUPPORTED' | 'UNSUPPORTED';
  serviceActivity: 'UNKNOWN' | 'AVAILABLE' | 'UNAVAILABLE';
}

export interface IAtm {
  latitude: number;
  longitude: number;
  address: string;
  allDay: boolean;
  openHours: IOpenHours;
  services: {
    wheelchair: IAtmService;
    blind: IAtmService;
    nfcForBankCards: IAtmService;
    qrRead: IAtmService;
    supportsUsd: IAtmService;
    supportsChargeRub: IAtmService;
    supportsEur: IAtmService;
    supportsRub: IAtmService;
  };
}
