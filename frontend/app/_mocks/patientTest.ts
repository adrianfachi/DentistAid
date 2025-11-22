import appointmentTest from "./appointmentTest";
import postTest from "./postTest";

const patientTest: patientType[] = [
	{
		patientId: 1,
		email: "teste@teste.com",
		cpf: "12345678900",
		name: "Adão Louco",
		telephone: "51996105286",
		birthDate: new Date(),
		occupation: "Doutor",
		origin: "Indicação de outro dentista",
		firstAppointment: new Date(),
		recurrence: "Monthly",
		createdAt: new Date(),
		updatedAt: new Date(),
		appointment: appointmentTest,
		post: postTest,
	},
];

export default patientTest;
