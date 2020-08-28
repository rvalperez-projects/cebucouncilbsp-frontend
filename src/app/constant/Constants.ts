export class ProfileLabels {

    public static categories: InstitutionCategoryInterface[] = [
        {code: '00', text: 'Preschool'},
        {code: '01', text: 'Primary'},
        {code: '02', text: 'Secondary'},
        {code: '03', text: 'Senior High'},
        {code: '04', text: 'College'},
        {code: '05', text: 'Community'},
    ];

    public static areaDistricts: AreaDistrictsInterface[] = [];
}

interface InstitutionCategoryInterface {
    code: string,
    text: string
}

export interface AreaDistrictsInterface {
    area: string,
    district: string
}