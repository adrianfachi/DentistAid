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
  const [selectedAppointment, setSelectedAppointment] = useState<appointmentType | undefined>(undefined); 

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



  return (
    <div className='min-w-1/3 p-4 bg-background rounded-xl shadow-lg border border-background-contrast/50'>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-foreground">Consultas Agendadas</h3>
      </div>
      {appointments && appointments.length !== 0 ? (
        <div className='flex gap-2 flex-col rounded-xl scroll-style overflow-auto' style={{ maxHeight: '300px' }}>
          {appointments.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()).map((a) => (
            <div
              key={a.appointmentId}
              className='bg-background-standard flex justify-between items-center p-3 rounded-lg border border-background-contrast cursor-pointer transition duration-150 hover:bg-background-contrast/70 hover:shadow-md'
              onClick={() => handleAppointmentClick(a)}
            >
              <p className="font-semibold text-foreground">{new Date(a.date).toLocaleDateString("pt-br", { timeZone: 'UTC' })}</p>
              <div className='flex gap-3 text-sm text-gray'>
                <p>Início: {new Date(a.startsAt).toLocaleTimeString("pt-br", { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Fim: {new Date(a.endsAt).toLocaleTimeString("pt-br", { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray/50 rounded-lg">
          <p className="text-gray italic">Nenhuma consulta encontrada para {patientName}.</p>
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

export default PatientAppointment;