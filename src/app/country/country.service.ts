import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from './entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countriesRepository: Repository<CountryEntity>,
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    return this.countriesRepository.find();
  }

  async findById(country_code: string): Promise<CountryEntity> {
    return this.countriesRepository.findOne({ code: country_code });
  }
}
