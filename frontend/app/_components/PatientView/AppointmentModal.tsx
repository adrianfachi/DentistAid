'use client';

import { useEffect, useState } from 'react'
import FormInput from '../FormInput'
import { MdClose } from 'react-icons/md'
import useAppontimentAPI from '@/app/_hooks/useAppointmentAPI';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean
  setIsOpen: () => void
  appointments?: appointmentType[]
  patientId: number
}

function AppointmentModal({ isOpen, setIsOpen, appointments = [], patientId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<newAppointmentType>({
    name: "",
    date: "",
    startsAt: "",
    endsAt: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const { createAppointment, error } = useAppontimentAPI()

  const postAppointment = async () => {
    setIsLoading(true);
    try {

      if (!form.date || !form.startsAt || !form.endsAt) {
        toast.error("Por favor, preencha a data e os horários.", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } });
        setIsLoading(false);
        return;
      }

      const fullStartsAt = `${form.date}T${form.startsAt}:00`;
      const fullEndsAt = `${form.date}T${form.endsAt}:00`;
      const body: newAppointmentType = {
        name: form.name.length > 0 ? form.name : `Consulta nº ${appointments.length + 1}`,
        date: form.date,
        startsAt: fullStartsAt,
        endsAt: fullEndsAt,
      };
      await createAppointment(patientId, body);

      if (error) {
        toast.error("Erro ao criar consulta", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Consulta criada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      }

    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <MdClose onClick={setIsOpen} className="absolute right-2 top-2 cursor-pointer text-2xl" />
        <h1 className='font-bold text-xl'>Nova consulta</h1>
        <FormInput
          id="appointmentDate"
          label="Data do consulta"
          placeHolder="22/09/2025"
          type="date"
          onChange={(e) => updateField("date", e.target.value)}
        />

        <FormInput
          id='eventName'
          label='Nome da consulta'
          placeHolder={`Consulta nº ${appointments.length + 1}`}
          type="text"
          onChange={(e) => updateField("name", e.target.value)}
        />
        <div className='flex items-end gap-2'>
          <FormInput
            id="initialTime"
            label="Horário"
            placeHolder="Horário de Início"
            type="text"
            onChange={(e) => updateField("startsAt", e.target.value)}
          />
          <FormInput
            id="endTime"
            placeHolder="Horário de Fim"
            type="text"
            onChange={(e) => updateField("endsAt", e.target.value)}
          />
        </div>
        <div className='flex justify-end'>
          <input type="button" value="Cadastrar consulta" className='bg-ligth-green w-fit px-3 py-1 rounded-md cursor-pointer' onClick={postAppointment} />
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal