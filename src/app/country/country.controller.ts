import { CountryResponse } from './model';
import { CountryService } from './country.service';
import { Controller, Get } from '@nestjs/common';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async allCountries() {
    return await this.countryService.findAll();
  }
}
