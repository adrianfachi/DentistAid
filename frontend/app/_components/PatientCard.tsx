'use client';

import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";
import usePatientAPI from "../_hooks/usePatientAPI";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import useAppontimentAPI from "../_hooks/useAppointmentAPI";


type Props = {
  patient: patientType
  onRestoreSuccess: (patientId: number) => void;
}

function PatientCard({ patient, onRestoreSuccess }: Props) {
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);
  const [appointments, setAppointment] = useState<appointmentType[] | null>(null)
  const { restorePatientById } = usePatientAPI();
  const { getApponitmentsById } = useAppontimentAPI();
  const recurrenceMapToPortuguese: Record<string, string> = {
    'Monthly': 'Mensal',
    'Bimonthly': 'Bimestral',
    'Quarterly': 'Trimestral',
    'Semiannual': 'Semestral',
    'Annual': 'Anual',
  };

  useEffect(() => {
    try {
      const fetchAppointment = async () => {
        const { error, data } = await getApponitmentsById(patient.patientId);
        if (!error) setAppointment(data);
      }
      fetchAppointment();
    } catch (error) {

    }
  }, [patient.patientId]) // Adicionei patient.patientId à lista de dependências

  function getLastAppointment(): Date | null {
    if (!appointments || appointments.length === 0) return null;

    const now = new Date();

    const filtered = appointments.filter(a => new Date(a.date) <= now);
    if (filtered.length === 0) return null;

    const last = filtered.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date) ? current : latest
    );

    return new Date(last.date);
  }

  const restorePatient = async () => {
    setIsRestoreLoading(true)
    try {
      const { error } = await restorePatientById(patient.patientId);
      if (error) {
        toast.error("Erro ao restaurar", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Paciente restaurado com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        onRestoreSuccess(patient.patientId);
      }
    } catch (error) {
      return
    } finally {
      setIsRestoreLoading(false)
    }
  }

  function getNextAppointment(): Date | null {
    if (!appointments || appointments.length === 0) return null;

    const now = new Date();

    // Ajusta 'now' para o início do dia para incluir consultas de hoje
    now.setHours(0, 0, 0, 0); 

    const filtered = appointments.filter(a => new Date(a.date) >= now);
    if (filtered.length === 0) return null;

    const next = filtered.reduce((earliest, current) =>
      new Date(current.date) < new Date(earliest.date) ? current : earliest
    );

    return new Date(next.date);
  }

  const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
  const bgClass = colors[patient.patientId % 3];
  const index = patient.name.trim().lastIndexOf(" ")
  const initialNameLetter = patient.name[0].toUpperCase() + (index != -1 ? patient.name[index + 1].toUpperCase() : "");

  function copyEmail() {
    if (!patient.email || patient.email.length <= 3) {
      toast.error("Email inválido", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      return
    }
    navigator.clipboard.writeText(patient.email);
    toast.success("Email copiado!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
  }

  return (
    <div className={`
      w-full sm:w-60 min-h-64 p-5 rounded-xl shadow-lg border border-background-contrast/50 flex flex-col items-center gap-4 text-sm bg-background hover:shadow-xl transition-all duration-300
    `}>
      <Link className="flex flex-col items-center gap-4 cursor-pointer w-full" href={{ pathname: "/patient", search: `?search=${patient.patientId}` }}>
        <div className={`${bgClass} w-16 h-16 flex justify-center text-2xl items-center rounded-full text-white font-bold shadow-md`}>
          {initialNameLetter}
        </div>
        
        <div className="text-center w-full">
          <p className="font-extrabold text-xl truncate mb-1">{patient.name}</p>
          <div className="flex justify-between w-full border-t border-background-contrast/30 pt-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Última Consulta:</p>
              <p className="text-sm font-semibold text-color-green">
                {getLastAppointment()?.toLocaleDateString("pt-BR") ?? "Nenhuma"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Próxima Consulta:</p>
              <p className="text-sm font-semibold text-color-blue">
                {getNextAppointment()?.toLocaleDateString("pt-BR") ?? "Nenhuma"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-2 border-t w-full pt-2">
          <p className="text-xs font-medium text-gray-500">Recorrência:</p>
          <p className="text-sm font-semibold text-foreground capitalize">
            {recurrenceMapToPortuguese[patient.recurrence as keyof typeof recurrenceMapToPortuguese] ?? patient.recurrence}
          </p>
        </div>
      </Link>
      
      <div className={`text-sm flex gap-3 w-full justify-center ${patient.deletedAt ? 'pt-2 border-t border-red-300' : 'pt-2 border-t border-background-contrast/50'}`}>
        <button 
          className="flex gap-1 items-center cursor-pointer p-2 rounded-lg bg-background-contrast"
          onClick={copyEmail}
        >
          <AiOutlineMail className="text-base" />
          Email
        </button>
        <a 
          className="flex gap-1 items-center cursor-pointer p-2 rounded-lg text-white bg-background-contrast" 
          href={`https://wa.me/${patient.telephone}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="text-base" />
          WhatsApp
        </a>
      </div>
      
      {patient.deletedAt && (
        <div className="relative w-full mt-2">
          <input 
            type="button" 
            value={isRestoreLoading ? "" : "Restaurar Paciente"} 
            className='w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer font-semibold shadow-md hover:bg-red-600 transition disabled:opacity-50' 
            onClick={restorePatient}
            disabled={isRestoreLoading}
          />
          {isRestoreLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
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
      )}
    </div>
  )
}

export default PatientCard;