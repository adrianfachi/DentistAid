'use client';

import { useEffect, useState } from "react";
import Body from "./_components/Body";
import PatientCard from "./_components/PatientCard";
import SearchUser from "./_components/SearchUser";
import NewPatientModal from "./_components/NewPatientModal";
import usePatientAPI from "./_hooks/usePatientAPI";
import { ScaleLoader } from "react-spinners";

export default function users() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [patientsData, setPatientsData] = useState<patientType[]>()
  const [isLoading, setIsLoading] = useState(true);
  const { getPatients } = usePatientAPI();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const result = await getPatients();
        setPatientsData(result);
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        setPatientsData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [])

  return (
    <Body activeNavBar="users">
      <div>
        <h1 className="text-2xl font-semibold">Dra. Natália Rossoni</h1>
        <SearchUser setIsOpenModal={() => setIsOpenModal(true)} />
        <div className="flex flex-wrap">
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <ScaleLoader
                color='var(--foreground)'
                height={20}
                width={4}
                radius={2}
                margin={2}
              />
            </div>
          ) : patientsData ? patientsData.map((patient) => (
            <PatientCard patient={patient} key={patient.patientId} />
          )) : (
            <div className="flex justify-center items-center h-full">
              <p>Nenhum paciente encontrado</p>
            </div>
          )}

        </div>
        <NewPatientModal isOpen={isOpenModal} setIsOpen={() => setIsOpenModal(false)} />
      </div>
    </Body>
  );
}
