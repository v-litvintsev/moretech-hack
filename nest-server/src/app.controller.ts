import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthChecker(): string {
    return this.appService.healthChecker();
  }

  @Get('/api/get-map-items')
  getMapItems() {
    return {
      offices: JSON.parse(
        fs.readFileSync('./data/offices.json', {
          encoding: 'utf-8',
        }),
      ),
      atms: JSON.parse(
        fs.readFileSync('./data/atms.json', {
          encoding: 'utf-8',
        }),
      ),
    };
  }
}
