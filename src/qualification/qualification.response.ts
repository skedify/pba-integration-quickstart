export interface QualificationResponse {
    qualificationScore: string;
    filters?: {
        contactIds?: string[] | null;
        contactExternalIds: string[];
        officeIds?: string[] | null;
        officeExternalIds?: string[] | null;
        listingIds?: string[] | null;
        listingExternalIds?: string[] | null;
        listingTags?: string[] | null;
        location?: {
            countryCode?: string | null;
            postalCode?: string | null;
        } | null;
        subjectIds?: string[] | null;
        subjectExternalIds?: string[] | null;
    }[] | null;
}