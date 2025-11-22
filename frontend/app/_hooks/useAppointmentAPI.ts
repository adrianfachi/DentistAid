import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://localhost:5432";

const useAppontimentAPI = () => {
	const [error, setError] = useState<string | null>(null);

	const createAppointment = async (patientId: number, body: newAppointmentType) => {
		setError(null);

		try {
			const response = await axios.post(`${BASE_URL}/patients/${patientId}/appointment`, body);

			if (!response) {
				throw new Error("Erro ao criar post");
			}

			const data = await response.data;

			return data;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	const updateAppointment = async (postId: string, body: newAppointmentType) => {
		setError(null);

		try {
			const response = await axios.patch(`${BASE_URL}/patients/${postId}`, body);

			if (!response) {
				throw new Error("Erro ao criar post");
			}

			const data = await response.data;
			return data;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	return { error, createAppointment, updateAppointment };
};

export default useAppontimentAPI;
