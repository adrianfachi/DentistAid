import React from 'react'

type Props = {
  appointments: appointmentType[] | undefined;
}

function PatientAppointment({ appointments }: Props) {
  return (
    <div className='min-w-1/3'>
      <h3 className="text-lg font-semibold mb-3">Controle de consultas</h3>
      {appointments && appointments.length != 0 ? (
        <div className='flex gap-4 flex-col py-5 px-2 shadow-blue-soft rounded-xl min-w-fit scroll-style overflow-auto' style={{ height: '300px' }}>
          {appointments.sort((a, b) => b.date.getTime() - a.date.getTime()).map((a, index) => (
            <div key={index} className=' border-gray flex justify-between gap-3'>
              <p>{a.name}</p>
              <p>{a.date.toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma consulta encontrada</p>
      )}
    </div>
  )
}

export default PatientAppointment