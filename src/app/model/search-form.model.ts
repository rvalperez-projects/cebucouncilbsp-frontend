export class SearchFormModel {
    areaList: Array<string>;
    districtList: Array<string>;
    institutionMap: Map<number, string>;
    name: string;

    constructor() {
        this.areaList = new Array<string>();
        this.districtList = new Array<string>();
        this.institutionMap = new Map<number, string>();
        this.name = '';
    }

    private resetCollections() {   
        this.areaList = [];
        this.districtList = [];
        this.institutionMap.clear();
        this.name = '';
    }
    
}