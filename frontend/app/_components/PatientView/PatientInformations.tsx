'use client';

import React, { useState } from 'react'
import FormInput from '../FormInput'
import usePatientAPI from '@/app/_hooks/usePatientAPI';
import toast from 'react-hot-toast';
import { ScaleLoader } from 'react-spinners';

type Props = {
  patient: patientType;
  editing: boolean;
}

function PatientInformations({ patient, editing }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const recurrenceMapToPortuguese: Record<string, string> = {
    'Monthly': 'Mensal',
    'Bimonthly': 'Bimestral',
    'Quarterly': 'Trimestral',
    'Semiannual': 'Semestral',
    'Annual': 'Anual',
  };
  const recurrenceMapToEnglish: Record<string, string> = {
    'Mensal': 'Monthly',
    'Bimestral': 'Bimonthly',
    'Trimestral': 'Quarterly',
    'Semestral': 'Semiannual',
    'Anual': 'Annual',
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

  const [form, setForm] = useState<newPatientType>({
    name: patient.name,
    email: patient.email,
    cpf: patient.cpf,
    birthDate: patient.birthDate.toISOString(),
    telephone: patient.telephone,
    occupation: patient.occupation,
    origin: patient.origin,
    recurrence: patient.recurrence,
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const { updatePatient } = usePatientAPI()

  const isPatientOriginInOptions = optionsOrigin.includes(patient.origin);
  const initialOrigin = isPatientOriginInOptions ? patient.origin : 'Outro';
  const [origin, setOrigin] = useState<string>(initialOrigin);

  const initialOtherOriginValue = !isPatientOriginInOptions ? patient.origin : '';
  const [otherOriginValue] = useState<string>(initialOtherOriginValue);

  const recurrences = ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
  const englishRecurrence = patient.recurrence;
  const initialRecurrence = recurrenceMapToPortuguese[englishRecurrence as keyof typeof recurrenceMapToPortuguese] || '';
  const [recurrence, setRecurrence] = useState<string>(initialRecurrence);

  const updateDataPatient = async () => {
    setIsLoading(true);
    try {
      const { error } = await updatePatient(patient.patientId, form);
      if (error) {
        toast.error("Erro ao alterar paciente", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Paciente alterado com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      }
    } catch (e) {
      return
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full p-4 bg-background rounded-xl shadow-lg border border-background-contrast/50">
      <h3 className="text-xl font-bold mb-5 border-b pb-2">Informações do Paciente</h3>

      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 w-full">

          <div className="flex flex-col gap-6 w-full">
            <FormInput
              id="birth"
              label="Data de Nascimento"
              placeHolder="22/09/1999"
              type="date"
              initialValue={patient.birthDate ? patient.birthDate.toISOString().split('T')[0] : ''}
              editable={editing}
              onChange={(e) => updateField("birthDate", e.target.value)}
            />
            <FormInput
              id="email"
              label="Email"
              placeHolder="exemplo@dominio.com"
              type="email"
              initialValue={patient.email}
              editable={editing}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <FormInput
              id="occupation"
              label="Ocupação"
              placeHolder="Ex: Engenheiro(a)"
              type="text"
              initialValue={patient.occupation}
              editable={editing}
              onChange={(e) => updateField("occupation", e.target.value)}
            />
            <FormInput
              id="telephone"
              label="Telefone"
              placeHolder="(00) 99999-9999"
              type="tel"
              initialValue={patient.telephone}
              editable={editing}
              onChange={(e) => updateField("telephone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <FormInput
              id="cpf"
              label="CPF"
              placeHolder="000.000.000-00"
              type="text"
              initialValue={patient.cpf}
              editable={editing}
              onChange={(e) => updateField("cpf", e.target.value)}
            />

            <div className={`flex flex-col gap-1 w-full ${!editing ? "text-gray-500" : "text-foreground"}`}>
              <label htmlFor="origin" className="text-sm font-medium">
                Origem
              </label>
              {editing ? (
                <select
                  name="origin"
                  id="origin"
                  className="w-full py-2 px-3 rounded-lg text-sm bg-background-standard border border-background-contrast focus:border-color-blue focus:ring-1 focus:ring-color-blue transition duration-150"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value)
                    e.target.value != "Outro" && updateField("origin", e.target.value)
                  }}
                >
                  <option value="" disabled>Selecione...</option>
                  {optionsOrigin.map((o) => (
                    <option value={o} key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <p className="py-2 px-3 rounded-lg text-sm bg-background-contrast/50 border border-transparent text-gray-500 cursor-default">
                  {origin || 'Não informado'}
                </p>
              )}
            </div>

            {origin === 'Outro' && (
              <FormInput
                id="otherOrigin"
                label="Qual a origem?"
                placeHolder="Ex: Conheceu no evento X"
                type="text"
                initialValue={otherOriginValue}
                editable={editing}
                onChange={(e) => updateField("origin", e.target.value)}
              />
            )}

            <div className={`flex flex-col gap-1 w-full ${!editing ? "text-gray-500" : "text-foreground"}`}>
              <label className="text-sm font-medium">Recorrência</label>
              {editing ? (
                <div className="flex flex-wrap gap-x-4 gap-y-2 py-1">
                  {recurrences.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer transition duration-150 hover:text-color-blue">
                      <input
                        type="radio"
                        name="recurrence"
                        id={`recurrence-${r}`}
                        value={r}
                        checked={recurrence === r}
                        onChange={(e) => {
                          setRecurrence(e.target.value)
                          updateField("recurrence", recurrenceMapToEnglish[e.target.value as keyof typeof recurrenceMapToEnglish])
                        }}
                        className="form-radio h-4 w-4 text-color-blue border-background-contrast focus:ring-color-blue"
                      />
                      <span className="text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="py-2 px-3 rounded-lg text-sm bg-background-contrast/50 border border-transparent text-gray-500 cursor-default">
                  {recurrence || 'Não informada'}
                </p>
              )}
            </div>

            {editing && (
              <div className="flex justify-end w-full pt-4">
                <div className="relative w-40">
                  <input
                    disabled={isLoading}
                    value={isLoading ? "" : "Salvar Alterações"}
                    type="button"
                    className={`
                      w-full py-2 px-4 rounded-lg font-semibold transition duration-200 shadow-md bg-green text-white cursor-pointer hover:bg-green/90
                    `}
                    onClick={updateDataPatient}
                  />

                  {isLoading && (
                    <div className="absolute inset-0 flex z-10 items-center justify-center">
                      <ScaleLoader
                        color="white"
                        height={20}
                        width={4}
                        radius={2}
                        margin={2}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default PatientInformations