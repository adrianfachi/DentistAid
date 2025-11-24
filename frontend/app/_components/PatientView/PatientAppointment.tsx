'use client';

import { useEffect, useState } from "react";
import AppointmentModal from "./AppointmentModal";

type Props = {
  appointments: appointmentType[] | undefined;
  patientId: number;
  patientName: string;
}

function PatientAppointment({ appointments, patientId, patientName }: Props) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<appointmentType>();

  const normalizeAppointment = (a: appointmentType) => {
    const dateISO = new Date(a.date).toISOString().split("T")[0];

    const startsAtTime = new Date(a.startsAt).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const endsAtTime = new Date(a.endsAt).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    return {
      ...a,
      date: dateISO,
      startsAt: startsAtTime,
      endsAt: endsAtTime
    };
  };

  const handleAppointmentClick = (appointment: appointmentType) => {
    setSelectedAppointment(normalizeAppointment(appointment));
    setIsOpenModal(true);
  };
  useEffect(() => {
    if (selectedAppointment) {
      console.log("Atualizou:", selectedAppointment)
    }
  }, [selectedAppointment])

  return (
    <div className='min-w-1/3'>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Controle de consultas</h3>
      </div>

      {appointments && appointments.length !== 0 ? (
        <div className='flex gap-4 flex-col py-5 px-2 shadow-blue-soft rounded-xl min-w-fit scroll-style overflow-auto' style={{ height: '300px' }}>
          {appointments.sort((a, b) => a.startsAt.localeCompare(b.startsAt)).map((a) => (
            <div
              key={a.appointmentId}
              className='border-gray flex justify-between gap-3 border-b cursor-pointer hover:bg-background-contrast p-2 rounded transition'
              onClick={() => handleAppointmentClick(a)}
            >
              <p className="font-medium">{a.name}</p>
              <p>{new Date(a.date).toLocaleDateString("pt-br", { timeZone: 'UTC' })}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className=" mb-3">Nenhuma consulta encontrada</p>
        </div>
      )}

      <AppointmentModal
        isOpen={isOpenModal}
        setIsOpen={() => {
          setIsOpenModal(false);
          setSelectedAppointment(undefined);
        }}
        patientId={patientId}
        patientName={patientName}
        appointments={appointments}
        content={selectedAppointment}
      />
    </div>
  )
}

export default PatientAppointment