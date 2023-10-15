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
import { INDIVIDUAL_SERVICES, LEGAL_SERVICES } from './constants';

const USER_COORDS = { latitude: 55.6908465, longitude: 37.5595371 };
const RISK_MULTIPLIER = 1.15;
const currentDate = new Date('2023-10-11T08:00:13.071Z');
const TICK_HOURS_DELTA = 6;

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

  constructor(private readonly appService: AppService) {
    setInterval(() => {
      const currentHours = currentDate.getHours();
      const currentWeekDay = currentDate.getDay();

      currentDate.setHours(currentHours + TICK_HOURS_DELTA);

      this.offices = this.offices.map((office) => {
        const officeHours =
          currentWeekDay === 0 || currentWeekDay === 6
            ? office.openHoursIndividual.weekends
            : office.openHoursIndividual.workingDays;

        if (
          Object.keys(officeHours.averageTraffic).includes(`${currentHours}`)
        ) {
          const officeTraffic = officeHours.averageTraffic[currentHours];
          const queueIndividual = officeTraffic
            ? Array(Math.floor(Math.random() * officeTraffic * 2))
                .fill(null)
                .map(
                  () =>
                    INDIVIDUAL_SERVICES[
                      Math.floor(Math.random() * INDIVIDUAL_SERVICES.length)
                    ],
                )
            : [];

          if (office.isLegalServing) {
            const queueLegal = officeTraffic
              ? Array(Math.floor(Math.random() * officeTraffic * 0.8))
                  .fill(null)
                  .map(
                    () =>
                      LEGAL_SERVICES[
                        Math.floor(Math.random() * LEGAL_SERVICES.length)
                      ],
                  )
              : [];
            return {
              ...office,
              queueIndividual,
              queueLegal,
              queueIndividualPrivileged: [],
            };
          }

          if (office.isPrivilegedServed) {
            const queueIndividualPrivileged = officeTraffic
              ? Array(Math.floor(Math.random() * officeTraffic * 0.3))
                  .fill(null)
                  .map(
                    () =>
                      INDIVIDUAL_SERVICES[
                        Math.floor(Math.random() * INDIVIDUAL_SERVICES.length)
                      ],
                  )
              : [];
            return {
              ...office,
              queueIndividual,
              queueIndividualPrivileged,
              queueLegal: [],
            };
          }

          return {
            ...office,
            queueIndividual,
            queueIndividualPrivileged: [],
            queueLegal: [],
          };
        }
        return {
          ...office,
          queueIndividual: [],
          queueIndividualPrivileged: [],
          queueLegal: [],
        };
      });
    }, 5000);
  }

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
      individual: INDIVIDUAL_SERVICES,
      legal: LEGAL_SERVICES,
    };
  }

  @Post('/api/get-offices')
  getOffices(@Body() body: GetSuitableOfficesDto) {
    if (
      body.service &&
      (body.userType === 'individual' || body.userType === 'legal')
    ) {
      const currentHours = currentDate.getHours();
      const currentWeekDay = currentDate.getDay();

      if (body.userType === 'individual') {
        const filteredAndSortedOffices = this.offices
          .filter((office) =>
            office.servicesListIndividual.some((officeService) => {
              const officeHours =
                currentWeekDay === 0 || currentWeekDay === 6
                  ? office.openHoursIndividual.weekends
                  : office.openHoursIndividual.workingDays;

              return (
                officeService.name === body.service &&
                Object.keys(officeHours.averageTraffic).includes(
                  `${currentHours}`,
                )
              );
            }),
          )
          .map((office) => {
            return {
              ...office,
              userDistance: Math.sqrt(
                // (body.coordinates.latitude + body.coordinates.longitude) ** 2 +
                //   (office.latitude + office.longitude) ** 2,
                (USER_COORDS.latitude - office.latitude) ** 2 +
                  (USER_COORDS.longitude - office.longitude) ** 2,
              ),
            };
          })
          .sort((a, b) => {
            return a.userDistance - b.userDistance;
          });

        filteredAndSortedOffices.splice(0, 10);

        // const outputOffices = filteredAndSortedOffices.map((office) => {
        //   if (body.isPrivileged) {
        //     const queueTime = Math.min(
        //       (office.queueIndividualPrivileged.reduce(
        //         (acc, service) => acc + service.averageTime,
        //         0,
        //       ) +
        //         office.queueIndividual.reduce(
        //           (acc, service) => acc + service.averageTime,
        //           0,
        //         )) /
        //         (office.windowsIndividualPrivileged + office.windowsIndividual),

        //       office.queueIndividualPrivileged.reduce(
        //         (acc, service) => acc + service.averageTime,
        //         0,
        //       ) / office.windowsIndividualPrivileged,
        //     );

        //     return {
        //       ...office,
        //       queueTime: queueTime * RISK_MULTIPLIER,
        //     };
        //   }

        //   return {
        //     ...office,
        //     queueTime:
        //       (office.queueIndividual.reduce(
        //         (acc, service) => acc + service.averageTime,
        //         0,
        //       ) /
        //         office.windowsIndividual) *
        //       RISK_MULTIPLIER,
        //   };
        // });

        return { offices: filteredAndSortedOffices };
      }

      if (body.userType === 'legal') {
        const filteredAndSortedOffices = this.offices
          .filter((office) =>
            office.servicesListLegal.some(
              (officeService) => officeService.name === body.service,
            ),
          )
          .map((office) => {
            return {
              ...office,
              userDistance: Math.sqrt(
                // (body.coordinates.latitude + body.coordinates.longitude) ** 2 +
                //   (office.latitude + office.longitude) ** 2,
                (USER_COORDS.latitude - office.latitude) ** 2 +
                  (USER_COORDS.longitude - office.longitude) ** 2,
              ),
            };
          })
          .sort((a, b) => {
            return a.userDistance - b.userDistance;
          });

        filteredAndSortedOffices.splice(0, 10);

        // const outputOffices = filteredAndSortedOffices.map((office) => {
        //   return {
        //     ...office,
        //     queueTime:
        //       (office.queueLegal.reduce(
        //         (acc, service) => acc + service.averageTime,
        //         0,
        //       ) /
        //         office.windowsLegal) *
        //       RISK_MULTIPLIER,
        //   };
        // });

        return { offices: filteredAndSortedOffices };
      }

      return { offices: this.offices };
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
