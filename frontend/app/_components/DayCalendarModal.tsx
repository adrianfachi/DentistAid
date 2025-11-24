'use client'

import { Dispatch, SetStateAction, useEffect } from 'react'


type Props = {
  isOpen: boolean
  setIsOpen: () => void
  appointments: appointmentType[]
  day: Date
  setModalUpdateOpen: Dispatch<SetStateAction<boolean>>
  setAppointment: Dispatch<SetStateAction<appointmentType | null>>
}

export default function DayCalendarModal({ isOpen, setIsOpen, appointments, day, setModalUpdateOpen, setAppointment }: Props) {

  useEffect(() => {
    if (typeof window === 'undefined') return

    const previousOverflow = document.body.style.overflow
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow || 'auto'
    }

    return () => {
      document.body.style.overflow = previousOverflow || 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={setIsOpen} />

      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3 overflow-auto scroll-style">
        <h1 className='font-bold text-xl'>Dia {day.toLocaleDateString("pt-br")}</h1>
        {appointments.length > 0 ? appointments.map((a) => (
          <div key={a.appointmentId} className='flex gap-3 border-b cursor-pointer hover:bg-background-contrast' onClick={() => {
            setModalUpdateOpen(true)

            const startsAtTime = new Date(a.startsAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });

            const endsAtTime = new Date(a.endsAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            const dateFormatted = new Date(a.date).toISOString().split('T')[0];
            const appointmentForm: appointmentType = {
              patientId: a.patientId,
              appointmentId: a.appointmentId,
              name: a.name,
              date: dateFormatted,
              startsAt: startsAtTime,
              endsAt: endsAtTime

            }
            setAppointment(appointmentForm)
          }}>
            <p>{a.name}</p>
            <p>De: {new Date(a.startsAt).toLocaleTimeString()}</p>
            <p>Até: {new Date(a.endsAt).toLocaleTimeString()}</p>
          </div>
        )) : <p>Sem eventos nesse dia</p>}
        <input type="button" value="Fechar" onClick={setIsOpen} className='bg-background-contrast rounded-xl w-fit px-3 py-1 cursor-pointer' />
      </div>
    </div>
  )
}
