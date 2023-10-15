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

class GetOfficesWithTimeDto {
  offices: IOffice[];
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
    // Эмуляция изменений очередей в течение работы отделений
    setInterval(() => {
      const currentHours = currentDate.getHours();
      const currentWeekDay = currentDate.getDay();

      currentDate.setHours(currentHours + TICK_HOURS_DELTA);

      this.offices = this.offices.map((office) => {
        const officeHours =
          currentWeekDay === 0 || currentWeekDay === 6
            ? office.openHoursIndividual.weekends
            : office.openHoursIndividual.workingDays;

        // Работает ли отделение в текущее время
        if (
          Object.keys(officeHours.averageTraffic).includes(`${currentHours}`)
        ) {
          const officeTraffic = officeHours.averageTraffic[currentHours];
          const isFirstHourInDay =
            Math.min(
              ...Object.keys(officeHours.averageTraffic).map((key) => +key),
            ) === currentHours;

          let queueIndividual = office.queueIndividual;

          // В первом рабочем часу заполняется очередь в отделении
          if (isFirstHourInDay) {
            queueIndividual = officeTraffic
              ? Array(Math.floor(Math.random() * 17))
                  .fill(null)
                  .map(
                    () =>
                      INDIVIDUAL_SERVICES[
                        Math.floor(Math.random() * INDIVIDUAL_SERVICES.length)
                      ],
                  )
              : [];
          } else {
            // Изменеие элементов в очереди происходит случайно
            if (Math.random() < 0.5) {
              queueIndividual.push(
                INDIVIDUAL_SERVICES[
                  Math.floor(Math.random() * INDIVIDUAL_SERVICES.length)
                ],
              );
            }

            if (Math.random() < 0.5) {
              queueIndividual.pop();
            }
          }

          if (office.isLegalServing) {
            let queueLegal = office.queueLegal;

            if (isFirstHourInDay) {
              queueLegal = officeTraffic
                ? Array(Math.floor(Math.random() * officeTraffic * 0.8))
                    .fill(null)
                    .map(
                      () =>
                        LEGAL_SERVICES[
                          Math.floor(Math.random() * LEGAL_SERVICES.length)
                        ],
                    )
                : [];
            } else {
              if (Math.random() < 0.5) {
                queueLegal.push(
                  LEGAL_SERVICES[
                    Math.floor(Math.random() * LEGAL_SERVICES.length)
                  ],
                );
              }

              if (Math.random() < 0.5) {
                queueLegal.pop();
              }
            }

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
  getOffices(@Body() body: GetSuitableOfficesDto): any {
    if (
      body.service &&
      (body.userType === 'individual' || body.userType === 'legal')
    ) {
      const currentHours = currentDate.getHours();
      const currentWeekDay = currentDate.getDay();

      if (body.userType === 'individual') {
        const filteredAndSortedOffices = this.offices
          // Фильтрация: работает ли отделение в текущее время
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
          // Вычисление расстояния до пользователя
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
          // Сортировка по близости к пользователю
          .sort((a, b) => {
            return a.userDistance - b.userDistance;
          });

        // Обрезание первых 10 отделений для отображения на карте
        filteredAndSortedOffices.splice(0, 10);

        return {
          offices: filteredAndSortedOffices,
          userType: body.userType,
          isPrivileged: body.isPrivileged,
        };
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

        return {
          offices: filteredAndSortedOffices,
          userType: body.userType,
          isPrivileged: body.isPrivileged,
        };
      }

      return {
        offices: this.offices,
        userType: body.userType,
        isPrivileged: body.isPrivileged,
      };
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/api/get-offices-with-time')
  getOfficesWithTime(@Body() body: GetOfficesWithTimeDto): any {
    if (body.userType === 'individual') {
      const outputOffices = body.offices.map((office) => {
        const currentHours = currentDate.getHours();
        const currentWeekDay = currentDate.getDay();

        const officeHours =
          currentWeekDay === 0 || currentWeekDay === 6
            ? office.openHoursIndividual.weekends
            : office.openHoursIndividual.workingDays;

        if (office.userDistance) {
          const travelTime = office.userDistance * 500;

          if (body.isPrivileged) {
            let queueTime = Math.min(
              (office.queueIndividualPrivileged.reduce(
                (acc, service) => acc + service.averageTime,
                0,
              ) +
                office.queueIndividual.reduce(
                  (acc, service) => acc + service.averageTime,
                  0,
                )) /
                (office.windowsIndividualPrivileged + office.windowsIndividual),

              office.queueIndividualPrivileged.reduce(
                (acc, service) => acc + service.averageTime,
                0,
              ) / office.windowsIndividualPrivileged,
            );

            if (travelTime > 60) {
              if (
                Object.keys(officeHours.averageTraffic).includes(
                  `${currentHours + Math.floor(travelTime / 60)}`,
                )
              ) {
                queueTime =
                  (queueTime / officeHours.averageTraffic[currentHours]) *
                  officeHours.averageTraffic[
                    currentHours + Math.floor(travelTime / 60)
                  ];
              }
            }

            return {
              ...office,
              queueTime: queueTime * RISK_MULTIPLIER,
            };
          }

          let queueTime =
            office.queueIndividual.reduce(
              (acc, service) => acc + service.averageTime,
              0,
            ) / office.windowsIndividual;

          if (
            Object.keys(officeHours.averageTraffic).includes(
              `${currentHours + Math.floor(travelTime / 60)}`,
            )
          ) {
            queueTime =
              (queueTime / officeHours.averageTraffic[currentHours]) *
              officeHours.averageTraffic[
                currentHours + Math.floor(travelTime / 60)
              ];
          }

          return {
            ...office,
            queueTime: queueTime * RISK_MULTIPLIER,
          };
        }
      });

      return { offices: outputOffices };
    }

    if (body.userType === 'legal') {
      const outputOffices = body.offices.map((office) => {
        const currentHours = currentDate.getHours();
        const currentWeekDay = currentDate.getDay();

        const officeHours =
          currentWeekDay === 0 || currentWeekDay === 6
            ? office.openHoursIndividual.weekends
            : office.openHoursIndividual.workingDays;

        if (office.userDistance) {
          const travelTime = office.userDistance * 500;
          let queueTime =
            office.queueLegal.reduce(
              (acc, service) => acc + service.averageTime,
              0,
            ) / office.windowsLegal;

          if (
            Object.keys(officeHours.averageTraffic).includes(
              `${currentHours + Math.floor(travelTime / 60)}`,
            )
          ) {
            queueTime =
              (queueTime / officeHours.averageTraffic[currentHours]) *
              officeHours.averageTraffic[
                currentHours + Math.floor(travelTime / 60)
              ];
          }

          return {
            ...office,
            queueTime: queueTime * RISK_MULTIPLIER,
          };
        }
      });

      return { offices: outputOffices };
    }

    const outputOffices = body.offices.map((office) => {
      return { ...office };
    });

    return { offices: outputOffices };
  }
}
