import { Contact } from "../value_objects/contact.vo";
import { Credentials } from "../value_objects/credentials.vo";
import { MedicalInfo } from "../value_objects/medical-info.vo";
import { Personal } from "../value_objects/personal.vo";


export class Patient {
    constructor(
        public readonly recordId: string,
        private credentials: Credentials,
        private personalInfo: Personal,
        private medicalInfo: MedicalInfo,
        private contact: Contact
    ) {}

    updateContactInfo(newContactInfo: Contact) {
        this.contact = newContactInfo;
    }

    updateCredentials(newCredentials: Credentials) {
        this.credentials = newCredentials;
    }

    updateMedicalInfo(newMedicalInfo: MedicalInfo) {
        this.medicalInfo = newMedicalInfo;
    }

    updatePersonalInfo(newPersonalInfo: Personal) {
        this.personalInfo = newPersonalInfo;
    }

    getContactInfo(): Contact {
        return this.contact;
    }

    getCredentials(): Credentials {
        return this.credentials;
    }

    getMedicalInfo(): MedicalInfo {
        return this.medicalInfo;
    }

    getPersonalInfo(): Personal {
        return this.personalInfo;
    }
}
