'use client';

import { useState } from "react";
import Body from "./_components/Body";
import PatientCard from "./_components/PatientCard";
import SearchUser from "./_components/SearchUser";
import patientTest from "./_mocks/patientTest";
import NewPatientModal from "./_components/NewPatientModal";

export default function users() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  return (
    <Body activeNavBar="users">
      <div>
        <h1 className="text-2xl font-semibold">Dra. Natália Rossoni</h1>
        <SearchUser setIsOpenModal={() => setIsOpenModal(true)} />
        <div className="flex flex-wrap">
          {patientTest.map((patient) => (
            <PatientCard patient={patient} key={patient.patientId} />
          ))}
        </div>
        <NewPatientModal isOpen={isOpenModal} setIsOpen={() => setIsOpenModal(false)} />
      </div>
    </Body>
  );
}
