export class Personal {
    constructor(
        private readonly cpf: string,
        private readonly name: string,
        private readonly birthDate: Date,
        private readonly occupation: string,
        private readonly origin: string,
    ) {}

    static create(
        cpf: string, name: string, birthDate: Date, occupation: string, origin: string
    ): Personal {
            return new Personal(cpf, name, birthDate, occupation, origin);
    }

    getCpf(): string {
        return this.cpf;
    }

    getName(): string {
        return this.name;
    }

    getBirthDate(): Date {
        return this.birthDate;
    }

    getOccupation(): string {
        return this.occupation;
    }

    getOrigin(): string {
        return this.origin;
    }

    equals(other: Personal): boolean {
        return this.cpf === other.cpf &&
               this.name === other.name &&
               this.birthDate.getTime() === other.birthDate.getTime() &&
               this.occupation === other.occupation &&
               this.origin === other.origin;
    }
}