export interface QualificationRequest {
    globalTransactionId: string;
    category: {
        externalKey: string;
        key: string;
        selfService: boolean;
    };
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        birthDate?: string;
        phoneNumber?: string;
        externalId?: string;
        customerNumber?: string;
        location?: {
            street: string;
            houseNumber: string;
            city: string;
            postalCode: string;
            country: string;
        }
        company?: string;
    };
    qualificationFields: {
        key: string;
        value?: string;
        type: string;
    }[];
}