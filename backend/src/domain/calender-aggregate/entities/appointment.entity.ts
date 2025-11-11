
import { Patient } from "src/domain/patient-aggregate/entities/patient.entity";
import { Period } from "../value-objects/period.vo";


export class Appointment {
    constructor(
        private readonly id: number,
        private name: string,
        private date: Date,
        private period: Period,
        private patient: Patient
    ) {}

    public create(
        id: number,
        name: string,
        date: Date,
        period: Period,
        patient: Patient,
    ) {
        return new Appointment(id, name, date, period, patient);
    }

    // Update mehthods...

    // Get methods...
}