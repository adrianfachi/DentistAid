import { Contact } from "../value_objects/contact.vo";
import { Credentials } from "../value_objects/credentials.vo";
import { MedicalInfo } from "../value_objects/medicalinfo.vo";
import { Personal } from "../value_objects/personal.vo";


export class Patient {
    constructor(
        public recordId: string,
        public credentials: Credentials,
        public personalInfo: Personal,
        public medicalInfo: MedicalInfo,
        public contact: Contact
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
