import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://localhost:5432";

const usePatientAPI = () => {
	const [error, setError] = useState<string | null>(null);

	const createPatient = async (body: patientType) => {
		setError(null);

		try {
			const response = await axios.post(`${BASE_URL}/patients`, {
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response) {
				throw new Error("Erro ao fazer login");
			}

			const data = await response.data;

			return data;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	const getPatients = async () => {
		setError(null);
		try {
			const response = await axios.get(`${BASE_URL}/patients`);

			if (!response) {
				throw new Error("Erro ao fazer login");
			}

			const data = await response.data;
			const patients = data.map((p: patientType) => ({
				...p,
				birthDate: new Date(p.birthDate),
				firstAppointment: p.firstAppointment ? new Date(p.firstAppointment) : null,
				createdAt: new Date(p.createdAt),
				updatedAt: new Date(p.updatedAt),
			}));
			return patients;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	const getPatientById = async (id: string | null): Promise<patientType | undefined> => {
		setError(null);
		if (!id) return undefined;

		try {
			const response = await axios.get(`${BASE_URL}/patients/${id}`);

			const p = response.data;

			const patient: patientType = {
				...p,
				birthDate: new Date(p.birth_date),
				firstAppointment: p.first_appointment ? new Date(p.first_appointment) : null,
				createdAt: new Date(p.createdAt),
				updateAt: new Date(p.updatedAt),
			};

			return patient;
		} catch (error: any) {
			setError(error.message);
			return undefined;
		}
	};

	return { error, createPatient, getPatients, getPatientById };
};

export default usePatientAPI;
