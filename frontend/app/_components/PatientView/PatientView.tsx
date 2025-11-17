'use client';

import { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import PatientInformations from './PatientInformations';
import PatientAppointment from './PatientAppointment';
import PatientPosts from './PatientPosts';
import PostModal from './PostModal';
import DeleteModal from '../DeleteModal';

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
    const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false)
    const [isOpenAppointmentModal, setIsOpenAppointmentModal] = useState<boolean>(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)

    return (
      <div className='flex flex-col gap-3'>
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center'>
            <div className={`${bgClass} w-20 h-20 flex justify-center text-3xl items-center rounded-full text-white font-bold`}>
              {initialNameLetter}
            </div>
            <h2 className="text-xl font-semibold">
              {patient.name} | {patient.patientId.toString().padStart(4, "0")}
            </h2>
            <FiEdit className={`${!editing && "text-gray "} cursor-pointer`} onClick={() => { setEditing(!editing) }} />
          </div>
          <div className='flex items-center gap-3'>
            <input type="button" value="Excuir paciente" onClick={() => { setIsOpenDeleteModal(true) }} className='py-1 rounded-md bg-red-400 text-red-800 cursor-pointer' style={{ width: '150px' }} />
            <input type="button" value="Nova postagem" onClick={() => { setIsOpenPostModal(true) }} className='py-1 rounded-md bg-ligth-green cursor-pointer' style={{ width: '150px' }} />
            <input type="button" value="Nova consulta" onClick={() => { setIsOpenAppointmentModal(true) }} className='py-1 rounded-md bg-dark-green cursor-pointer' style={{ width: '150px' }} />
          </div>
          <PostModal isOpen={isOpenPostModal} setIsOpen={() => setIsOpenPostModal(false)} />
          <PostModal isOpen={isOpenAppointmentModal} setIsOpen={() => setIsOpenAppointmentModal(false)} />
          <DeleteModal isOpen={isOpenDeleteModal} setIsOpen={() => setIsOpenDeleteModal(false)} />
        </div>
        <div className='flex gap-10 h-fit'>
          <PatientInformations patient={patient} editing={editing} />
          <PatientAppointment appointments={patient.appointment} />
        </div>
        <PatientPosts posts={patient.post} />
      </div>
    )
  }

  return (
    <p>Paciente não encontrado</p >
  )
}

export default PatientView