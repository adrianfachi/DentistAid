'use client'

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { patientValidateSchema } from "../_utils/newPatientValidate";
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import FormInput from './FormInput'
import usePatientAPI from '../_hooks/usePatientAPI'
import toast from 'react-hot-toast'
import { ScaleLoader } from "react-spinners";
import { MdClose } from "react-icons/md";

type Props = {
  isOpen: boolean
  setIsOpen: () => void
  setPatients: Dispatch<SetStateAction<patientType[]>>
}

export default function NewPatientModal({ isOpen, setIsOpen, setPatients }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(patientValidateSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      birthDate: "",
      telephone: "",
      email: "",
      cpf: "",
      occupation: "",
      origin: "",
      recurrence: "",
    }
  });

  const watchedOrigin = watch("origin");
  const watchedRecurrence = watch("recurrence");

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const recurrenceMap: Record<string, string> = {
    'Mensal': 'Monthly',
    'Bimestral': 'Bimonthly',
    'Trimestral': 'Quarterly',
    'Semestral': 'Semiannual',
    'Anual': 'Annual',
  };

  const { createPatient } = usePatientAPI()

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

  const postPatient = async (data: newPatientType) => {
    setIsLoading(true);
    try {

      const { error, data: newPatient } = await createPatient(data);
      if (error) {
        toast.error("Erro ao criar paciente", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Paciente criado com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        setPatients((e) => e && [...e, newPatient])
        reset();
        setIsOpen();
      }
    } catch (e) {
      console.error("Erro na submissão: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const optionsOrigin = [
    'Instagram',
    'WhatsApp',
    'Indicação de amigo',
    'Indicação de familiar',
    'Indicação de outro dentista',
    'Indicação de paciente',
    'Evento',
    'Outro',
  ]

  const recurrences = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={setIsOpen} />

      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3 overflow-auto min-h-[calc(100%-2rem)] h-[calc(100%-2rem)] w-full max-w-lg mx-4 scroll-style">
        <MdClose onClick={setIsOpen} className="absolute right-4 top-4 cursor-pointer text-2xl" />
        <h1 className='font-bold text-2xl mb-4 text-center'>Cadastro de Novo Paciente</h1>

        <form onSubmit={handleSubmit(postPatient)} className="flex flex-col gap-4">

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                id="name"
                label="Nome Completo"
                placeHolder="Ex: João da Silva"
                type="text"
                {...field}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <FormInput
                id="birthDate"
                label="Data de nascimento"
                placeHolder="18/10/2025"
                type="date"
                {...field}
                error={errors.birthDate?.message}
              />
            )}
          />

          <Controller
            name="telephone"
            control={control}
            render={({ field }) => (
              <FormInput
                id="telephone"
                label="Telefone"
                placeHolder="+5511987654321"
                type="text"
                {...field}
                error={errors.telephone?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                id="email"
                label="Email"
                placeHolder="email@exemplo.com"
                type="text"
                {...field}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <FormInput
                id="cpf"
                label="CPF"
                placeHolder="123.456.789-00"
                type="text"
                {...field}
                error={errors.cpf?.message}
              />
            )}
          />

          <Controller
            name="occupation"
            control={control}
            render={({ field }) => (
              <FormInput
                id="occupation"
                label="Ocupação"
                placeHolder="Ex: Engenheiro"
                type="text"
                {...field}
                error={errors.occupation?.message}
              />
            )}
          />

          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-0.5">
                <label htmlFor="origin">Origem</label>
                <select
                  id="origin"
                  className="border p-2 rounded-md bg-background"
                  {...field}
                >
                  <option value="">Selecione...</option>
                  {optionsOrigin.map((o) => (
                    <option value={o} key={o}>{o}</option>
                  ))}
                </select>
                {errors.origin?.message && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.origin?.message}
                  </div>
                )}
              </div>
            )}
          />

          {watchedOrigin === 'Outro' && (
            <Controller
              name="origin"
              control={control}
              render={({ field }) => (
                <FormInput
                  id="otherOrigin"
                  label="Outro (Especifique)"
                  placeHolder="Como conheceu"
                  type="text"
                  {...field}
                  error={errors.origin?.message}
                />
              )}
            />
          )}

          <Controller
            name="recurrence"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-0.5">
                <label>Recorrência</label>
                <div className="flex flex-wrap gap-4">
                  {recurrences.map((r) => (
                    <label key={r} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        value={recurrenceMap[r]}
                        checked={field.value === recurrenceMap[r]}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="form-radio text-blue-500 h-4 w-4"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
                {errors.recurrence?.message && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.recurrence?.message}
                  </div>
                )}
              </div>
            )}
          />

          <div className="flex justify-end pt-4">
            <div className="relative">
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`w-32 py-2 rounded-md font-semibold transition duration-300 ${isLoading || !isValid ? 'bg-background-contrast cursor-not-allowed' : 'bg-ligth-green text-white hover:bg-green cursor-pointer'}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ScaleLoader className="animate-spin h-5 w-5 mr-2" />
                  </div>
                ) : (
                  "Cadastrar"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}