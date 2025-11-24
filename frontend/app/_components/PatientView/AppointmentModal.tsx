'use client';

import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdClose } from 'react-icons/md'
import toast from 'react-hot-toast';
import useAppontimentAPI from '@/app/_hooks/useAppointmentAPI';
import FormInput from '../FormInput'
import { appointmentValidateSchema } from "../../_utils/appointmentValidade";

type Props = {
  isOpen: boolean
  setIsOpen: () => void
  appointments?: appointmentType[]
  patientId: number
  patientName?: string
  content?: appointmentType
}

type FormType = {
  name?: string | undefined;
  date: string;
  startsAt: string;
  endsAt: string;
}

function AppointmentModal({ isOpen, setIsOpen, appointments = [], patientId, patientName, content }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { createAppointment, updateAppointment } = useAppontimentAPI()

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(appointmentValidateSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: content?.name || '',
      date: content?.date || '',
      startsAt: content?.startsAt || '',
      endsAt: content?.endsAt || ''
    }
  });

  useEffect(() => {
    if (content) {
      reset({
        name: content.name || '',
        date: content.date || '',
        startsAt: content.startsAt || '',
        endsAt: content.endsAt || ''
      });
    }
  }, [content, reset]);


  const postAppointment = async (data: FormType) => {
    setIsLoading(true);
    try {

      const dateISO = new Date(data.date).toISOString().split('T')[0];
      const fullStartsAt = `${dateISO}T${data.startsAt}:00.000`;
      const fullEndsAt = `${dateISO}T${data.endsAt}:00.000`;



      if (content) {
        const body: newAppointmentType = {
          patientId: patientId,
          name: data.name ? data.name : `Consulta ${patientName} nº ${appointments.length + 1}`,
          date: dateISO,
          startsAt: fullStartsAt,
          endsAt: fullEndsAt,
        };

        const { error } = await updateAppointment(content.appointmentId, body);
        if (error) {
          toast.error("Erro ao alterar consulta", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
        } else {
          toast.success("Consulta alterada com sucesso!", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
          reset();
          setIsOpen();
        }
      } else {
        const body: newAppointmentType = {
          patientId: patientId,
          name: data.name ? data.name : `Consulta ${patientName} nº ${appointments.length + 1}`,
          date: dateISO,
          startsAt: fullStartsAt,
          endsAt: fullEndsAt,
        };

        const { error } = await createAppointment(body);
        if (error) {
          toast.error("Erro ao criar consulta", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
        } else {
          toast.success("Consulta criada com sucesso!", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
          reset();
          setIsOpen();
        }
      }



    } catch (error) {
      console.error("Erro na submissão:", error);
      toast.error("Erro inesperado ao criar consulta");
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
      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3 overflow-auto scroll-style max-w-md">
        <MdClose onClick={setIsOpen} className="absolute right-2 top-2 cursor-pointer text-2xl" />
        <h1 className='font-bold text-xl'>{content ? 'Editar consulta' : 'Nova consulta'}</h1>

        <form onSubmit={handleSubmit(postAppointment)} className="flex flex-col gap-3">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <FormInput
                id="date"
                label="Data da consulta"
                placeHolder="22/09/2025"
                initialValue={content?.date}
                type="date"
                {...field}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                id='eventName'
                label='Nome da consulta (opcional)'
                initialValue={content?.name}
                placeHolder={`Consulta ${patientName} nº ${appointments.length + 1}`}
                type="text"
                {...field}
                error={errors.name?.message}
              />
            )}
          />

          <div className='flex items-end gap-2'>
            <Controller
              name="startsAt"
              control={control}
              render={({ field }) => (
                <FormInput
                  id="initialTime"
                  label="Horário de Início"
                  placeHolder="09:00"
                  type="text"
                  isTimeInput={true}
                  typeMask='time'
                  initialValue={content?.startsAt}
                  {...field}
                  error={errors.startsAt?.message}
                  className="w-50"
                />
              )}
            />
            <Controller
              name="endsAt"
              control={control}
              render={({ field }) => (
                <FormInput
                  id="endTime"
                  placeHolder="10:00"
                  type="text"
                  isTimeInput={true}
                  typeMask='time'
                  initialValue={content?.endsAt}
                  {...field}
                  error={errors.endsAt?.message}
                  className="w-50"
                />
              )}
            />
          </div>
          <div className='flex justify-end pt-2'>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-fit px-3 py-1 rounded-md cursor-pointer font-semibold transition duration-300 
                            ${isLoading || !isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-ligth-green text-white hover:bg-green'}`}
            >
              {isLoading ? "Carregando..." : content ? "Atualizar consulta" : "Cadastrar consulta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentModal