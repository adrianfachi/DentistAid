import { Contact } from "../value-objects/contact.vo.js";
import { Credentials } from "../value-objects/credentials.vo.js";
import { MedicalInfo } from "../value-objects/medical-info.vo.js";
import { Personal } from "../value-objects/personal.vo.js";


export class Patient {
    constructor(
        public readonly id: number,
        private credentials: Credentials,
        private personalInfo: Personal,
        private medicalInfo: MedicalInfo,
        private contact: Contact
    ) {}

    static create(
        id: number,
        credentials: Credentials,
        personalInfo: Personal,
        medicalInfo: MedicalInfo,
        contact: Contact
    ): Patient {
        return new Patient(id, credentials, personalInfo, medicalInfo, contact);
    }

    updateContactInfo(newContactInfo: Contact): this {
        this.contact = newContactInfo;
        return this;
    }

    updateCredentials(newCredentials: Credentials): this {
        this.credentials = newCredentials;
        return this;
    }

    updateMedicalInfo(newMedicalInfo: MedicalInfo): this {
        this.medicalInfo = newMedicalInfo;
        return this;
    }

    updatePersonalInfo(newPersonalInfo: Personal): this {
        this.personalInfo = newPersonalInfo;
        return this;
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

    equals(other: Patient): boolean {
        return this.id === other.id;
    }
}
