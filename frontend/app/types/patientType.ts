type patientType = {
	patientId: number;
	email: string;
	cpf: string;
	name: string;
	telephone: string;
	birth: Date;
	occupation: string;
	origin: string;
	first_appointment: Date;
	recurrence: string;
	createdAt: Date;
	updateAt: Date;
	deletedAt?: Date;
	appointment?: appointmentType[];
	post?: postType[];
};
