'use client';

import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi';

type Props = {
  patient: patientType | undefined
}

function PatientView({ patient }: Props) {

  if (patient) {
    const [editing, setEditing] = useState<boolean>(false)
    const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
    const bgClass = colors[patient!.patientId % 3];
    const index = patient!.name.trim().lastIndexOf(" ")
    const initialNameLetter = patient!.name[0].toUpperCase() + (index != -1 && patient!.name[index + 1].toUpperCase());

    return (
      <div>
        <div className='flex gap-2 items-center'>
          <div className={`${bgClass} w-20 h-20 flex justify-center text-3xl items-center rounded-full text-white font-bold`}>
            {initialNameLetter}
          </div>
          <h2>
            {patient.name} | {patient.patientId.toString().padStart(4, "0")}
          </h2>
          <FiEdit className={`${!editing && "text-gray "} cursor-pointer`} onClick={() => { setEditing(!editing) }} />
        </div>

      </div>
    )
  }


  return (
    <p>Paciente não encontrado</p >
  )
}

export default PatientView