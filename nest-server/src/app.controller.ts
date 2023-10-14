import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { IOffice } from './types/office';
import { IAtm } from './types/atm';

@Controller()
export class AppController {
  offices = JSON.parse(
    fs.readFileSync('./data/offices.json', {
      encoding: 'utf-8',
    }),
  ) as IOffice[];
  atms = JSON.parse(
    fs.readFileSync('./data/atms.json', {
      encoding: 'utf-8',
    }),
  ) as IAtm[];

  constructor(private readonly appService: AppService) {}

  @Get()
  healthChecker(): string {
    return this.appService.healthChecker();
  }

  @Get('/api/get-map-items')
  getMapItems() {
    return {
      offices: this.offices,
      atms: this.atms,
    };
  }

  @Get('/api/get-offices')
  getOffices(
    @Query('service') service,
    @Query('userType') userType: 'individual' | 'legal',
  ) {
    if (service) {
      if (userType === 'individual') {
        const suitableOffices = this.offices.filter((office) =>
          office.servicesListIndividual.some(
            (officeService) => officeService.name === service,
          ),
        );

        return { offices: suitableOffices };
      }

      if (userType === 'legal') {
        const suitableOffices = this.offices.filter((office) =>
          office.servicesListLegal.some(
            (officeService) => officeService.name === service,
          ),
        );

        return { offices: suitableOffices };
      }

      return { offices: this.offices };
    } else {
      return { offices: this.offices };
    }
  }
}
