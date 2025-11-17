export class Contact {
    constructor(
        private readonly telephone: string
    ) {}

    static create(telephone: string): Contact {
        return new Contact(telephone);
    }

    getTelephone(): string {
        return this.telephone;
    }

    equals(other: Contact): boolean {
        return this.telephone === other.telephone;
    }
}