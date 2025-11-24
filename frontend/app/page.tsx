'use client';

import { useEffect, useState } from "react";
import Body from "./_components/Body";
import PatientCard from "./_components/PatientCard";
import SearchUser from "./_components/SearchUser";
import NewPatientModal from "./_components/NewPatientModal";
import usePatientAPI from "./_hooks/usePatientAPI";
import { ScaleLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

export default function Patients() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [patientsData, setPatientsData] = useState<patientType[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loadedDeleted, setLoadedDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("")

  const { getPatients, deletedPatients } = usePatientAPI();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data, error } = await getPatients();
        if (!error) setPatientsData(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, []);

  const getDeletedPatientsHandler = async () => {
    setShowDeleted((prev) => !prev);
    if (loadedDeleted) return;

    try {
      setIsLoading(true);
      const { data, error } = await deletedPatients();
      if (!error) {
        setPatientsData((prev) => [...prev, ...data]);
        setLoadedDeleted(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientRestored = (patientId: number) => {
    setPatientsData((prev) =>
      prev.map(patient => {
        if (patient.patientId === patientId) {
          return {
            ...patient,
            deletedAt: undefined,
          };
        }
        return patient;
      })
    );
  };

  const filteredPatients = patientsData
    .filter((p) => showDeleted ? p.deletedAt : !p.deletedAt)
    .filter((p) => {
      if (!filter) return true;

      const searchTerm = filter.toLowerCase().trim();
      const name = p.name?.toLowerCase() || '';
      const email = p.email?.toLowerCase() || '';
      const telephone = p.telephone?.toLowerCase() || '';
      const cpf = p.cpf?.toLowerCase() || '';

      return (
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        telephone.includes(searchTerm) ||
        cpf.includes(searchTerm)
      );
    });

  return (
    <Body activeNavBar="users">
      <div>
        <h1 className="text-2xl font-semibold">Dra. Natália Rossoni</h1>

        <SearchUser
          setIsOpenModal={() => setIsOpenModal(true)}
          getDeletedPatients={getDeletedPatientsHandler}
          showDeleted={showDeleted}
          setFilter={setFilter}
        />

        <div className="flex flex-wrap">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <ScaleLoader
                color="var(--foreground)"
                height={20}
                width={4}
                radius={2}
                margin={2}
              />
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard
                patient={patient}
                key={patient.patientId}
                onRestoreSuccess={handlePatientRestored}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>Nenhum paciente encontrado</p>
            </div>
          )}
        </div>

        <NewPatientModal
          isOpen={isOpenModal}
          setIsOpen={() => setIsOpenModal(false)}
          setPatients={setPatientsData}
        />

        <Toaster position="top-right" />
      </div>
    </Body>
  );
}