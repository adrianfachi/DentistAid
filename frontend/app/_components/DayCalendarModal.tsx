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
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="absolute inset-0 bg-black/60" onClick={setIsOpen} />
      <div className="relative p-6 bg-background-standard rounded-xl shadow-2xl flex flex-col gap-5 max-h-[80vh] w-11/12 max-w-md overflow-auto scroll-style border border-background-contrast/50">
        <h1 className='font-extrabold text-2xl border-b pb-2 border-background-contrast'>
          Dia {day.toLocaleDateString("pt-br", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h1>
        {appointments.length > 0 ? (
          <div className='flex flex-col gap-2'>
            {appointments.map((a) => (
              <div 
                key={a.appointmentId} 
                className='flex flex-col p-3 rounded-lg border border-background-contrast cursor-pointer transition duration-150 hover:bg-background-contrast/70 hover:shadow-md' 
                onClick={() => {
                  setIsOpen()
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
                <p className='font-semibold text-foreground'>{a.name}</p>
                <div className='flex justify-between text-sm text-gray'>
                  <p>Início: {new Date(a.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Fim: {new Date(a.endsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray italic text-center py-4'>Nenhum agendamento encontrado para este dia.</p>
        )}

        <input 
          type="button" 
          value="Fechar" 
          onClick={setIsOpen} 
          className='bg-color-background-contrast text-foreground font-semibold rounded-lg w-full mt-2 py-2 cursor-pointer transition hover:bg-background-contrast/80 active:scale-[0.99]' 
        />
      </div>
    </div>
  )
}