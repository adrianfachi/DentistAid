import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://localhost:5432";

const usePatientAPI = () => {
	const [error, setError] = useState<string | null>(null);

	const createPatient = async (body: newPatientType) => {
		setError(null);

		try {
			const response = await axios.post(`${BASE_URL}/patients`, body);

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
				createdAt: p.createdAt ? new Date(p.createdAt) : null,
				updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
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

	const deletePatient = async (id: number | null) => {
		setError(null);
		if (!id) return undefined;

		try {
			await axios.delete(`${BASE_URL}/patients/${id}`);
		} catch (error: any) {
			setError(error.message);
		}
	};

	return { error, createPatient, getPatients, getPatientById, deletePatient };
};

export default usePatientAPI;
