export class MedicalInfo {
    constructor(
        private readonly first_appointment: Date,
        private readonly recurrence: string,
    ) {}

    static create(first_appointment: Date, recurrence: string): MedicalInfo {
        return new MedicalInfo(first_appointment, recurrence);
    }

    getFirstAppointment(): Date {
        return this.first_appointment;
    }

    getRecurrence(): string {
        return this.recurrence;
    }

    equals(other: MedicalInfo): boolean {
        return this.first_appointment.getTime() === other.first_appointment.getTime() &&
               this.recurrence === other.recurrence;
    }
}