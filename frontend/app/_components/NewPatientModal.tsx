'use client'

import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import FormInput from './FormInput'
import usePatientAPI from '../_hooks/usePatientAPI'
import toast, { Toaster } from 'react-hot-toast'
import { ScaleLoader } from 'react-spinners'

type Props = {
  isOpen: boolean
  setIsOpen: () => void
}

export default function NewPatientModal({ isOpen, setIsOpen }: Props) {
  const [origin, setOrigin] = useState<string>('')
  const [recurrence, setRecurrence] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const recurrenceMap: Record<string, string> = {
    'Mensal': 'Monthly',
    'Bimestral': 'Bimonthly',
    'Trimestral': 'Quarterly',
    'Semestral': 'Semiannual',
    'Anual': 'Annual',
  };

  const [form, setForm] = useState<newPatientType>({
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    telephone: "",
    occupation: "",
    firstAppointment: "",
    origin: "",
    recurrence: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const { createPatient, error } = usePatientAPI()


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

  const postPatient = async () => {
    setIsLoading(true);
    try {
      await createPatient(form);
      if (error) {
        toast.error("Erro ao criar paciente", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Paciente criado com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      }
    } catch (e) {
      return
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

      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3 overflow-auto min-h-[calc(100%-2rem)] h-[calc(100%-2rem)] scroll-style">
        <MdClose onClick={setIsOpen} className="absolute right-2 top-2 cursor-pointer text-2xl" />
        <h1 className='font-bold text-xl'>Novo paciente</h1>
        <FormInput id="name" label="Nome Completo" placeHolder="Nome" type="text" onChange={(e) => updateField("name", e.target.value)} />
        <FormInput id="birth" label="Data de nascimento" placeHolder="22/09/1999" type="date" onChange={(e) => updateField("birthDate", e.target.value)} />
        <FormInput id='telephone' label='Telefone' placeHolder='+5551999999999' type="text" onChange={(e) => updateField("telephone", e.target.value)} />
        <FormInput id="email" label="Email" placeHolder="Email" type="text" onChange={(e) => updateField("email", e.target.value)} />
        <FormInput id="cpf" label="CPF" placeHolder="CPF" type="text" onChange={(e) => updateField("cpf", e.target.value)} />
        <FormInput id="ocupation" label="Ocupação" placeHolder="Ocupação" type="text" onChange={(e) => updateField("occupation", e.target.value)} />

        <div className="flex flex-col gap-0.5">
          <label htmlFor="origin">Origem</label>
          <select
            name="origin"
            id="origin"
            className="border p-1 rounded-md border-background-contrast bg-background"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value)
              updateField("origin", e.target.value)
            }}
          >
            <option value="">Selecione...</option>
            {optionsOrigin.map((o) => (
              <option value={o} key={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {origin === 'Outro' && <FormInput id="Outer" label="Outro" placeHolder="Como conheceu" type="text" />}

        <FormInput id="firstAppointment" label="Data da primeira consulta" placeHolder="07/03/2025" type="date" onChange={(e) => updateField("firstAppointment", e.target.value)} />

        <div className="flex flex-col gap-0.5">
          <label>Recorrência</label>
          <div className="flex gap-2">
            {recurrences.map((r) => (
              <label key={r} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="recurrence"
                  id={`recurrence-${r}`}
                  value={r}
                  checked={recurrence === r}
                  onChange={(e) => {
                    setRecurrence(e.target.value)
                    updateField("recurrence", recurrenceMap[e.target.value as keyof typeof recurrenceMap])
                  }}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <div className="relative">
            <input
              type="button"
              disabled={isLoading}
              value={isLoading ? "" : "Cadastrar"}
              className="bg-ligth-green w-35 py-1 rounded-md cursor-pointer"
              onClick={postPatient}
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ScaleLoader
                  color="var(--foreground)"
                  height={20}
                  width={4}
                  radius={2}
                  margin={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
