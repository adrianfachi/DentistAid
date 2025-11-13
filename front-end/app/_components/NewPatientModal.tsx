'use client'

import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import FormInput from './FormInput'

type Props = {
  isOpen: boolean
  setIsOpen: () => void
}

export default function NewPatientModal({ isOpen, setIsOpen }: Props) {
  const [origin, setOrigin] = useState<string>('')
  const [recurrence, setRecurrence] = useState<string>('')


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
        <FormInput id="postNumber" label="Número de Prontuário" placeHolder="Prontuário" type="text" />
        <FormInput id="name" label="Nome Completo" placeHolder="Nome" type="text" />
        <FormInput id="birth" label="Data de nascimento" placeHolder="22/09/1999" type="date" />
        <FormInput id="email" label="Email" placeHolder="Email" type="string" />
        <FormInput id="cpf" label="CPF" placeHolder="CPF" type="string" />
        <FormInput id="ocupation" label="Ocupação" placeHolder="Ocupação" type="string" />

        <div className="flex flex-col gap-0.5">
          <label htmlFor="origin">Origem</label>
          <select
            name="origin"
            id="origin"
            className="border p-1 rounded-md border-background-contrast bg-background"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
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

        <FormInput id="firstAppointment" label="Data da primeira consulta" placeHolder="07/03/2025" type="date" />

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
                  onChange={(e) => setRecurrence(e.target.value)}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>
        <div className='flex justify-end'>
          <input type="button" value="Cadastrar" className='bg-ligth-green w-fit px-3 py-1 rounded-md cursor-pointer' />
        </div>
      </div>
    </div>
  )
}
