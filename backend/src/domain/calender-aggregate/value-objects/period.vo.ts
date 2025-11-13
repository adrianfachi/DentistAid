export class Period {
    constructor(
        private startsAt: Date,
        private endsAt: Date
    ) {
        const durationMs = this.endsAt.getTime() - this.startsAt.getTime();
        const oneHourMs = 60 * 60 * 1000;

        // Validate: starts exactly on the hour
        if (this.startsAt.getMinutes() !== 0 || this.startsAt.getSeconds() !== 0) {
        throw new Error("Start time must be exactly at the beginning of an hour (e.g., 09:00, 13:00)");
        }

        // Validate: must be exactly 1 hour duration
        if (durationMs !== oneHourMs) {
        throw new Error("Appointment duration must be exactly 1 hour");
        }
    }

    public create(
            startsAt: Date,
            endsAt: Date
    ): Period {
            return new Period(startsAt, endsAt);
    }

    getStartsAt(): Date {
        return this.startsAt;
    }

    getEndsAt(): Date {
        return this.endsAt;
    }

    equals(other: Period): boolean {
        return this.startsAt === other.startsAt && this.endsAt === other.endsAt;
    }
}