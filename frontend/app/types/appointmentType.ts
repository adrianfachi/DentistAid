type appointmentType = {
	patientId: number;
	appointmentId: string;
	name: string;
	date: string;
	startsAt: string;
	endsAt: string;
	cancelledAt?: Date;
};
