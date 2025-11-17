'use client';

import React, { useState } from 'react'
import FormInput from '../FormInput'

type Props = {
  patient: patientType;
  editing: boolean; // controla modo de edição
}

function PatientInformations({ patient, editing }: Props) {
  const recurrenceMap: Record<string, string> = {
    'Monthly': 'Mensal',
    'Bimonthly': 'Bimestral',
    'Quarterly': 'Trimestral',
    'Semiannual': 'Semestral',
    'Annual': 'Anual',
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
  ];

  const isPatientOriginInOptions = optionsOrigin.includes(patient.origin);
  const initialOrigin = isPatientOriginInOptions ? patient.origin : 'Outro';
  const [origin, setOrigin] = useState<string>(initialOrigin);

  const initialOtherOriginValue = !isPatientOriginInOptions ? patient.origin : '';
  const [otherOriginValue] = useState<string>(initialOtherOriginValue);

  const recurrences = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
  const englishRecurrence = patient.recurrence;
  const initialRecurrence = recurrenceMap[englishRecurrence as keyof typeof recurrenceMap] || '';
  const [recurrence, setRecurrence] = useState<string>(initialRecurrence);

  const displayedOrigin = origin === 'Outro' ? initialOtherOriginValue : origin;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Informações do paciente</h3>

      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <div className="flex flex-col gap-3 w-full">
            <FormInput
              id="birth"
              label="Data de nascimento"
              placeHolder="22/09/1999"
              type="date"
              value={patient.birthDate ? patient.birthDate.toISOString().split('T')[0] : ''}
              editable={editing}
            />
            <FormInput
              id="email"
              label="Email"
              placeHolder="Email"
              type="string"
              value={patient.email}
              editable={editing}
            />
            <FormInput
              id="ocupation"
              label="Ocupação"
              placeHolder="Ocupação"
              type="string"
              value={patient.occupation}
              editable={editing}
            />
            <FormInput
              id="firstAppointment"
              label="Data da primeira consulta"
              placeHolder="07/03/2025"
              type="date"
              value={patient.firstAppointment ? patient.firstAppointment.toISOString().split('T')[0] : ''}
              editable={editing}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <FormInput
              id="telephone"
              label="Telefone"
              placeHolder="51 99999-9999"
              type="text"
              value={patient.telephone}
              editable={editing}
            />
            <FormInput
              id="cpf"
              label="CPF"
              placeHolder="CPF"
              type="string"
              value={patient.cpf}
              editable={editing}
            />

            <div className="flex flex-col gap-0.5">
              <label htmlFor="origin" className={`${!editing && "text-gray"}`}>
                Origem
              </label>
              {editing ? (
                <select
                  name="origin"
                  id="origin"
                  className="border p-1 rounded-md border-background-contrast bg-background"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                >
                  <option value="" disabled hidden>Selecione...</option>
                  {optionsOrigin.map((o) => (
                    <option value={o} key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <p className="border p-1 rounded-md border-background-contrast text-gray">
                  {displayedOrigin || 'Não informado'}
                </p>
              )}
            </div>

            {origin === 'Outro' && (
              <FormInput
                id="otherOrigin"
                label="Outro"
                placeHolder="Como conheceu"
                type="text"
                value={otherOriginValue}
                editable={editing}
              />
            )}

            <div className="flex flex-col gap-0.5">
              <label className={`${!editing && "text-gray"}`}>Recorrência</label>
              {editing ? (
                <div className="flex flex-wrap gap-3">
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
              ) : (
                <p className="border p-1 rounded-md border-background-contrast text-gray">
                  {recurrence || 'Não informada'}
                </p>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex justify-end w-full">
            <input
              type="button"
              value="Salvar"
              className="bg-ligth-green text-white font-medium w-fit px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientInformations
