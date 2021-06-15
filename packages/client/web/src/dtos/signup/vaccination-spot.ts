export interface ISignUpVaccinationSpotFormDataDTO {
    vaccinationSpotPicture: File;
    name: string;
    phone: number;
    document: string;
    street: string;
    streetNumber: string;
    vacine: string;
    quantity: number;
    expiration: Date
}
