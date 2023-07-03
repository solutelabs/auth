"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const countries_1 = require("./data/countries");
const entity_1 = require("../../../../app/country/entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let SeederService = class SeederService {
    constructor(countriesRepository) {
        this.countriesRepository = countriesRepository;
        this.countriesData = countries_1.countries;
    }
    async seed() {
        await this.countries();
    }
    async countries() {
        for (const country of this.countriesData) {
            const dbCountry = await this.countriesRepository.findOne({
                where: { name: country.name },
            });
            if (!dbCountry) {
                const newCountry = await this.countriesRepository.create(country);
                await this.countriesRepository.save(newCountry);
            }
        }
    }
};
SeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.CountryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeederService);
exports.SeederService = SeederService;
//# sourceMappingURL=seeder.service.js.map