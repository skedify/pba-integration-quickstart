export interface QualificationResponse {
    qualificationScore: string;
    filters?: {
        contactExternalIds: string[];
        countryCode?: string;
        postalCode?: string;
    }[];
}