import { Repository } from 'typeorm';
import { CountryEntity } from './entity';
export declare class CountryService {
    private countriesRepository;
    constructor(countriesRepository: Repository<CountryEntity>);
    findAll(): Promise<CountryEntity[]>;
    findById(country_code: string): Promise<CountryEntity>;
}
