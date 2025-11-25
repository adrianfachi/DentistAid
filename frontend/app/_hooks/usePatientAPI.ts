import axios from "axios";

const BASE_URL = "http://localhost:5432";

const usePatientAPI = () => {
  const formatAxiosError = (error: any) => {
    const serverMessage = (error as any)?.response?.data?.message;
    return serverMessage || (error as Error).message;
  };

  const createPatient = async (body: newPatientType) => {
    try {
      const response = await axios.post(`${BASE_URL}/patients`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const updatePatient = async (id: number, body: newPatientType) => {
    try {
      const response = await axios.patch(`${BASE_URL}/patients/${id}`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const getPatients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients`);

      if (!response) {
        throw new Error("Erro ao fazer login");
      }

      const data = response.data;
      const patients = data.map((p: patientType) => ({
        ...p,
        birthDate: new Date(p.birthDate),
        firstAppointment: p.firstAppointment ? new Date(p.firstAppointment) : null,
        createdAt: p.createdAt ? new Date(p.createdAt) : null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
      }));
      return { data: patients, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  };

  const getPatientById = async (id: string | null): Promise<patientType | undefined> => {
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
      return undefined;
    }
  };

  const deletedPatients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/deleted`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const deletePatient = async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/patients/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const restorePatientById = async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/patients/restore/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  return {
    createPatient,
    updatePatient,
    getPatients,
    getPatientById,
    deletePatient,
    deletedPatients,
    restorePatientById,
  };
};

export default usePatientAPI;