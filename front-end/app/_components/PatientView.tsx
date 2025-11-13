import React from 'react'

type Props = {
  patient: patientType | undefined
}

function PatientView({ patient }: Props) {

  if (patient) {
    const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
    const bgClass = colors[patient!.patientId % 3];
    const index = patient!.name.trim().lastIndexOf(" ")
    const initialNameLetter = patient!.name[0].toUpperCase() + (index != -1 && patient!.name[index + 1].toUpperCase());

    return (
      <div className={`${bgClass} w-20 h-20 flex justify-center text-3xl items-center rounded-full text-white font-bold`}>
        {initialNameLetter}
      </div>
    )
  }


  return (
    <p>Paciente não encontrado</p >
  )
}

export default PatientView