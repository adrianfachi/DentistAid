'use client';

import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdClose } from 'react-icons/md'
import toast from 'react-hot-toast';
import useAppontimentAPI from '@/app/_hooks/useAppointmentAPI';
import FormInput from './FormInput'
import { appointmentCalendarValidateSchema } from "../_utils/appointmentCalendarValidate";

type Props = {
  isOpen: boolean
  setIsOpen: () => void
  patients: patientType[];
}

type FormType = {
  patientId: number;
  name?: string;
  date: string;
  startsAt: string;
  endsAt: string;
}

function EventModal({ isOpen, setIsOpen, patients }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { createAppointment } = useAppontimentAPI()

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(appointmentCalendarValidateSchema),
    mode: "onChange",
    defaultValues: {
      patientId: undefined,
      name: '',
      date: '',
      startsAt: '',
      endsAt: ''
    }
  });

  const postAppointment = async (data: FormType) => {
    setIsLoading(true);
    try {
      const patient = patients.find(p => p.patientId === data.patientId);
      if (!patient) {
        toast.error("Paciente inválido.");
        return;
      }

      const dateISO = new Date(data.date).toISOString().split('T')[0];
      const fullStartsAt = `${dateISO}T${data.startsAt}:00.000`;
      const fullEndsAt = `${dateISO}T${data.endsAt}:00.000`;

      const body: newAppointmentType = {
        patientId: data.patientId,
        name: data.name ? data.name : `Consulta ${patient.name}`,
        date: dateISO,
        startsAt: fullStartsAt,
        endsAt: fullEndsAt,
      };

      const { error } = await createAppointment(body);

      if (error) {
        toast.error("Erro ao criar consulta");
      } else {
        toast.success("Consulta criada com sucesso!");
        reset();
        setIsOpen();
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={setIsOpen} />

      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3 overflow-auto scroll-style">

        <MdClose onClick={setIsOpen} className="absolute right-2 top-2 cursor-pointer text-2xl" />
        <h1 className='font-bold text-xl'>Nova consulta</h1>

        <form onSubmit={handleSubmit(postAppointment)} className="flex flex-col gap-3">

          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-0.5">
                <label>Paciente</label>
                <select
                  {...field}
                  className="border p-1 rounded-md border-background-contrast bg-background"
                >
                  <option value="">Selecione...</option>
                  {patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {errors.patientId && (
                  <p className="text-red-500 text-sm">{errors.patientId.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <FormInput
                id="date"
                label="Data"
                placeHolder="22/11/2025"
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
                id="eventName"
                label="Nome da consulta (opcional)"
                placeHolder="Consulta"
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
                  {...field}
                  error={errors.endsAt?.message}
                  className="w-50"
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`mt-2 w-fit px-4 py-1 rounded-md font-semibold 
              ${!isValid ? "bg-gray-400 cursor-not-allowed" : "bg-ligth-green text-white hover:bg-green"}`}
          >
            {isLoading ? "Carregando..." : "Cadastrar consulta"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default EventModal;
