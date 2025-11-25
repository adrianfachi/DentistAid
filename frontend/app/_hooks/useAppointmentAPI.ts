import axios from "axios";

const BASE_URL = "http://localhost:5432";

const useAppontimentAPI = () => {
  const formatAxiosError = (error: any) => {
    const serverMessage = (error as any)?.response?.data?.message;
    return serverMessage || (error as Error).message;
  };

  const createAppointment = async (body: newAppointmentType) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointments`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const updateAppointment = async (id: string, body: newAppointmentType) => {
    try {
      const response = await axios.patch(`${BASE_URL}/appointments/${id}`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
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

  const getApponitmentsById = async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/patient/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const deleteAppointment = async (postId: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/appointments/${postId}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  return { createAppointment, updateAppointment, getApponitments, getApponitmentsById, deleteAppointment };
};

export default useAppontimentAPI;