'use client';

import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { style } from "framer-motion/client";


type Props = {
  patient: patientType
}

function PatientCard({ patient }: Props) {

  function getLastAppointment(appointments: appointmentType[] | undefined): Date | null {
    if (!appointments || appointments.length === 0) return null;

    const now = new Date();

    const filtered = appointments.filter(a => a.date <= now);
    if (filtered.length === 0) return null;

    const last = filtered.reduce((latest, current) =>
      current.date > latest.date ? current : latest
    );

    return last.date;
  }

  function getNextAppointment(appointments: appointmentType[] | undefined): Date | null {
    if (!appointments || appointments.length === 0) return null;

    const now = new Date();

    const filtered = appointments.filter(a => a.date >= now);
    if (filtered.length === 0) return null;

    const next = filtered.reduce((earliest, current) =>
      current.date < earliest.date ? current : earliest
    );

    return next.date;
  }
  const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
  const bgClass = colors[patient.patientId % 3];
  const index = patient.name.trim().lastIndexOf(" ")
  const initialNameLetter = patient.name[0].toUpperCase() + (index != -1 && patient.name[index + 1].toUpperCase());

  function copyEmail() {
    if (!patient.email || patient.email.length <= 3) {
      toast.error("Erro ao copiar email", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      return
    }
    navigator.clipboard.writeText(patient.email);
    toast.success("Email copiado!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
  }

  return (
    <div className="bg-background-standard w-fit p-4 rounded-lg hover:bg-background-contrast transition-colors duration-200 flex flex-col items-center gap-3 text-[0.7rem]">
      <Link className="flex flex-col items-center gap-3 cursor-pointer" href={{ pathname: "/patient", search: `?search=${patient.patientId}` }}>
        <div className={`${bgClass} w-12 h-12 flex justify-center text-2xl items-center rounded-full text-white font-bold`}>
          {initialNameLetter}
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">{patient.name}</p>
          <p>Última consulta:</p>
          <p className="text-[#1b9e5f]">{getLastAppointment(patient.appointment)?.toLocaleDateString("pt-BR") ?? "Nenhuma"}</p>
        </div>
        <div className="text-center">
          <p>Próxima consulta:</p>
          <p className="text-[#0075EB]">{getNextAppointment(patient.appointment)?.toLocaleDateString("pt-BR") ?? "Nenhuma"}</p>
        </div>
        <div className="text-center">
          <p>Consultas:</p>
          <p className="text-[#11C76F] capitalize">{patient.recurrence}</p>
        </div>
      </Link>
      <div className="text-sm flex gap-3">
        <div className="flex gap-0.5 items-center cursor-pointer p-1" onClick={copyEmail}>
          <AiOutlineMail />
          Copiar Email
          <Toaster position="top-right" />
        </div>
        <a className="flex gap-0.5 items-center cursor-pointer p-1" href={`https://wa.me/${patient.telephone}`} target="_blank">
          <FaWhatsapp />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

export default PatientCard;