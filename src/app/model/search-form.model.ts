import { InstitutionModel, UnitNumberModel } from './entities.model';

export class SearchFormModel {
    areaList: Array<string>;
    districtList: Array<string>;
    institutionMap: Map<number, InstitutionModel>;
    name: string;

    constructor() {
        this.areaList = new Array<string>();
        this.districtList = new Array<string>();
        this.institutionMap = new Map<number, InstitutionModel>();
        this.name = '';
    }

    private resetCollections() {   
        this.areaList = [];
        this.districtList = [];
        this.institutionMap.clear();
        this.name = '';
    }
    
}

export class UnitNumberSearchResult {
    institutionUnitNumbers: UnitNumberModel[]; 
    availableUnitNumbers: UnitNumberModel[];
}