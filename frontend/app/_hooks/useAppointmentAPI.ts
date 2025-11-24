import axios from "axios";
import { useState } from "react";
import appointmentTest from "../_mocks/appointmentTest";

const BASE_URL = "http://localhost:5432";

const useAppontimentAPI = () => {
	const createAppointment = async (body: newAppointmentType) => {
		try {
			const response = await axios.post(`${BASE_URL}/appointments`, body);

			return { data: response.data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	};

	const updateAppointment = async (id: string, body: newAppointmentType) => {
		try {
			const response = await axios.patch(`${BASE_URL}/appointments/${id}`, body);

			return { data: response.data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	};

	const getApponitments = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/appointments`);

			return { data: response.data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	};

	return { createAppointment, updateAppointment, getApponitments };
};

export default useAppontimentAPI;
