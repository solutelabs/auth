import { CountryService } from './country.service';
export declare class CountryResolver {
    private readonly countryService;
    constructor(countryService: CountryService);
    allCountries(): Promise<import("./entity").CountryEntity[]>;
}
