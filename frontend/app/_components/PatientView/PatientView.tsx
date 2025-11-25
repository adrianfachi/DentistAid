'use client';

import { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import PatientInformations from './PatientInformations';
import PatientAppointment from './PatientAppointment';
import PatientPosts from './PatientPosts';
import PostModal from './PostModal';
import DeleteModal from '../DeleteModal';
import usePatientAPI from '@/app/_hooks/usePatientAPI';
import toast, { Toaster } from 'react-hot-toast';
import AppointmentModal from './AppointmentModal';

type Props = {
  patient: patientType | undefined
}

function PatientView({ patient }: Props) {

  if (patient) {
    const [editing, setEditing] = useState<boolean>(false)
    const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
    const bgClass = colors[patient!.patientId % 3];
    const index = patient!.name.trim().lastIndexOf(" ")
    const initialNameLetter = patient!.name[0].toUpperCase() + (index != -1 ? patient.name[index + 1].toUpperCase() : "");
    const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false);
    const [isOpenAppointmentModal, setIsOpenAppointmentModal] = useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const { deletePatient } = usePatientAPI();

    const deletePatientById = async (id: number) => {
      setIsLoading(true);
      try {
        const { error } = await deletePatient(id);

        if (error) {
          toast.error("Erro ao deletar paciente", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        } else {
          toast.success("Paciente deletado com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        }

      } catch (error) {
        console.error("Erro ao deletar paciente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <div className='flex flex-col gap-6 p-4 md:p-8 bg-background-standard rounded-xl shadow-xl'>
        
        <div className='flex justify-between items-center border-b pb-4'>
          <div className='flex gap-4 items-center'>
            <div className={`${bgClass} w-20 h-20 flex justify-center text-3xl items-center rounded-full text-white font-bold shadow-lg`}>
              {initialNameLetter}
            </div>
            <div className='flex flex-col'>
              <h2 className="text-3xl font-extrabold text-foreground">
                {patient.name}
              </h2>
              <span className="text-sm font-mono text-gray-500">
                ID: {patient.patientId.toString().padStart(4, "0")}
              </span>
            </div>
            <FiEdit 
              className={`text-2xl ml-4 cursor-pointer transition hover:text-color-blue ${!editing ? "text-gray-500" : "text-color-blue"}`} 
              onClick={() => { setEditing(!editing) }} 
            />
          </div>
          
          <div className='flex items-center gap-4'>
            <input 
              type="button" 
              value="Excluir Paciente" 
              onClick={() => { setIsOpenDeleteModal(true) }} 
              className='px-4 py-2 rounded-lg bg-red-600 text-white font-semibold cursor-pointer shadow-md hover:bg-red-700 transition' 
            />
            <input 
              type="button" 
              value="Nova Postagem" 
              onClick={() => { setIsOpenPostModal(true) }} 
              className='px-4 py-2 rounded-lg bg-ligth-green text-white font-semibold cursor-pointer shadow-md hover:bg-ligth-green/90 transition' 
            />
            <input 
              type="button" 
              value="Nova Consulta" 
              onClick={() => { setIsOpenAppointmentModal(true) }} 
              className='px-4 py-2 rounded-lg bg-dark-green text-white font-semibold cursor-pointer shadow-md hover:bg-dark-green/90 transition' 
            />
          </div>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-fit'>
          <div className='lg:col-span-2'>
            <PatientInformations patient={patient} editing={editing} />
          </div>
          <div className='lg:col-span-1'>
            <PatientAppointment appointments={patient.appointments} patientId={patient.patientId} patientName={patient.name}/>
          </div>
        </div>
        
        <PatientPosts posts={patient.posts} />
        
        <PostModal isOpen={isOpenPostModal} setIsOpen={() => setIsOpenPostModal(false)} patientId={patient.patientId} />
        <AppointmentModal isOpen={isOpenAppointmentModal} setIsOpen={() => setIsOpenAppointmentModal(false)} appointments={patient.appointments} patientId={patient.patientId} patientName={patient.name} />
        <DeleteModal isOpen={isOpenDeleteModal} setIsOpen={() => setIsOpenDeleteModal(false)} onDelete={() => deletePatientById(patient.patientId)} isLoading={isLoading} />
        <Toaster position='top-right' />
      </div>
    )
  }

  return (
    <div className='p-8 flex justify-center items-center h-full'>
      <p className="text-xl font-medium text-gray-500">Paciente não encontrado</p >
    </div>
  )
}

export default PatientView