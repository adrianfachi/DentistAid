type patientType = {
	patientId: number;
	email: string;
	cpf: string;
	name: string;
	telephone: string;
	birthDate: Date;
	occupation: string;
	origin: string;
	firstAppointment: Date;
	recurrence: string;
	createdAt: Date;
	updateAt: Date;
	deletedAt?: string;
	appointment?: appointmentType[];
	post?: postType[];
};
