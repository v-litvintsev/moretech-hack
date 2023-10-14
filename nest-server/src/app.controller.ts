import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { IOffice } from './types/office';
import { IAtm } from './types/atm';

const USER_COORDS = { latitude: 55.6908465, longitude: 37.5595371 };

class GetSuitableOfficesDto {
  service: string;
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

  @Post('/api/get-offices')
  getOffices(@Body() body: GetSuitableOfficesDto) {
    if (
      body.service &&
      (body.userType === 'individual' || body.userType === 'legal')
    ) {
      if (body.userType === 'individual') {
        const outputOffices = this.offices
          .filter((office) =>
            office.servicesListIndividual.some(
              (officeService) => officeService.name === body.service,
            ),
          )
          .map((office) => {
            return {
              ...office,
              userDistance: Math.sqrt(
                // (body.coordinates.latitude + body.coordinates.longitude) ** 2 +
                //   (office.latitude + office.longitude) ** 2,
                (USER_COORDS.latitude + USER_COORDS.longitude) ** 2 +
                  (office.latitude + office.longitude) ** 2,
              ),
            };
          })
          .sort((a, b) => {
            return a.userDistance - b.userDistance;
          });

        return { offices: outputOffices };
      }

      if (body.userType === 'legal') {
        const outputOffices = this.offices
          .filter((office) =>
            office.servicesListLegal.some(
              (officeService) => officeService.name === body.service,
            ),
          )
          .map((office) => {
            return {
              ...office,
              userDistance: Math.sqrt(
                (body.coordinates.latitude + body.coordinates.longitude) ** 2 +
                  (office.latitude + office.longitude) ** 2,
              ),
            };
          })
          .sort((a, b) => {
            return a.userDistance - b.userDistance;
          });

        return { offices: outputOffices };
      }

      return { offices: this.offices };
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
