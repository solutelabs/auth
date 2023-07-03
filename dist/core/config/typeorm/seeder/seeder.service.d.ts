import { CountryEntity } from 'src/app/country/entity';
import { Repository } from 'typeorm';
export declare class SeederService {
    private countriesRepository;
    private countriesData;
    constructor(countriesRepository: Repository<CountryEntity>);
    seed(): Promise<void>;
    countries(): Promise<void>;
}
