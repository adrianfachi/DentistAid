export class Credentials {
    constructor(
        private readonly email: string,
        private readonly password: string
    ) {}

    static create(email: string, password: string): Credentials {
        return new Credentials(email, password);
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    equals(other: Credentials): boolean {
        return this.email === other.email &&
               this.password === other.password;
    }
}