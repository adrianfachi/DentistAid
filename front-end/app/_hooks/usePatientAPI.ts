import axios from "axios";
import { useState } from "react";
import patientTest from "../_mocks/patientTest";

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
		// try {
		// 	const response = await axios.post(`${BASE_URL}/patients}`);

		// 	if (!response) {
		// 		throw new Error("Erro ao fazer login");
		// 	}

		// 	const data = await response.data;
		// 	return data;
		// } catch (error: any) {
		// 	setError(error.message);
		// 	return null;
		// }
		return patientTest;
	};

	const getPatientById = async (id: string | null): Promise<patientType | undefined> => {
		setError(null);
		if (!id) {
			return undefined;
		}

		const numericId = parseInt(id, 10);

		// try {
		// 	const response = await axios.post(`${BASE_URL}/patient/${id}`);

		// 	if (!response) {
		// 		throw new Error("Erro ao fazer login");
		// 	}

		// 	const data = await response.data;
		// 	return data;
		// } catch (error: any) {
		// 	setError(error.message);
		// 	return null;
		// }

		return patientTest.find((patient) => patient.patientId === numericId);
	};

	return { createPatient, getPatients, getPatientById };
};

export default usePatientAPI;
