'use client';

import React, { useState } from 'react'
import FormInput from '../FormInput'
import usePatientAPI from '@/app/_hooks/usePatientAPI';
import toast from 'react-hot-toast';
import { ScaleLoader } from 'react-spinners';

type Props = {
  patient: patientType;
  editing: boolean; // controla modo de edição
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
              initialValue={patient.birthDate ? patient.birthDate.toISOString().split('T')[0] : ''}
              editable={editing}
              onChange={(e) => updateField("birth", e.target.value)}
            />
            <FormInput
              id="email"
              label="Email"
              placeHolder="Email"
              type="text"
              initialValue={patient.email}
              editable={editing}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <FormInput
              id="occupation"
              label="Ocupação"
              placeHolder="Ocupação"
              type="text"
              initialValue={patient.occupation}
              editable={editing}
              onChange={(e) => updateField("occupation", e.target.value)}
            />
            <FormInput
              id="telephone"
              label="Telefone"
              placeHolder="+5551999999999"
              type="text"
              initialValue={patient.telephone}
              editable={editing}
              onChange={(e) => updateField("telephone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <FormInput
              id="cpf"
              label="CPF"
              placeHolder="CPF"
              type="text"
              initialValue={patient.cpf}
              editable={editing}
              onChange={(e) => updateField("cpf", e.target.value)}
            />

            <div className="flex flex-col gap-0.5">
              <label htmlFor="origin" className={`${!editing && "text-gray"}`}>
                Origem
              </label>
              {editing ? (
                <select
                  name="origin"
                  id="origin"
                  className="border py-2 px-1 rounded-md border-background-contrast bg-background"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value)
                    e.target.value != "Outro" && updateField("origin", e.target.value)
                  }}
                >
                  <option value="" disabled hidden>Selecione...</option>
                  {optionsOrigin.map((o) => (
                    <option value={o} key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <p className="border p-2 border-input rounded-md border-background-contrast text-gray">
                  {origin || 'Não informado'}
                </p>
              )}
            </div>

            {origin === 'Outro' && (
              <FormInput
                id="otherOrigin"
                label="Outro"
                placeHolder="Como conheceu"
                type="text"
                initialValue={otherOriginValue}
                editable={editing}
                onChange={(e) => updateField("origin", e.target.value)}
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
                        onChange={(e) => {
                          setRecurrence(e.target.value)
                          updateField("recurrence", recurrenceMapToEnglish[e.target.value as keyof typeof recurrenceMapToEnglish])
                        }}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="border p-2 rounded-md border-background-contrast text-gray">
                  {recurrence || 'Não informada'}
                </p>
              )}
              {editing && (
                <div className="flex justify-end w-full mt-5">
                  <div className="relative">
                    <input
                      disabled={isLoading}
                      value={isLoading ? "" : "Salvar"}
                      type="button"
                      className="bg-ligth-green text-white font-medium w-30 py-2 rounded-md cursor-pointer hover:opacity-90 transition"
                      onClick={updateDataPatient}
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
              )}
            </div>
          </div>
        </div>

      </div>
    </div >
  )
}

export default PatientInformations
