import { CountryService } from './country.service';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    allCountries(): Promise<import("./entity").CountryEntity[]>;
}
