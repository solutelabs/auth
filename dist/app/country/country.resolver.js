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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const model_1 = require("./model");
const country_service_1 = require("./country.service");
let CountryResolver = class CountryResolver {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async allCountries() {
        return this.countryService.findAll();
    }
};
__decorate([
    (0, graphql_1.Query)(() => [model_1.CountryResponse]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryResolver.prototype, "allCountries", null);
CountryResolver = __decorate([
    (0, graphql_1.Resolver)(() => model_1.CountryResponse),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryResolver);
exports.CountryResolver = CountryResolver;
//# sourceMappingURL=country.resolver.js.map