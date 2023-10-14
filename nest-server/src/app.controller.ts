import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { IOffice } from './types/office';
import { IAtm } from './types/atm';

class GetSuitableOfficesDto {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  userType: 'legal' | 'individual';
  isPrivileged?: boolean;
}

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

  @Get('/api/get-services')
  getServices() {
    return {
      individual: [
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
      legal: [
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

  // @Post('/api/get-suitable-offices')
  // getSuitableOffices(@Body() body: GetSuitableOfficesDto) {
  //   const outputOffices = this.offices
  //     .map((office) => {
  //       return {
  //         ...office,
  //         userDistance: Math.sqrt(
  //           (body.coordinates.latitude + body.coordinates.longitude) ** 2 +
  //             (office.latitude + office.longitude) ** 2,
  //         ),
  //       };
  //     })
  //     .sort((a, b) => {
  //       return a.userDistance - b.userDistance;
  //     });

  //   if (body.userType === 'individual') {
  //     return;
  //   }

  //   return { offices: outputOffices };
  // }
}
