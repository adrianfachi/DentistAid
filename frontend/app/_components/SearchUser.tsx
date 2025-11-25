'use client';

import { Dispatch, SetStateAction } from "react";
import { FiPlus } from "react-icons/fi"
import { PiMagnifyingGlassLight } from "react-icons/pi";

type Props = {
  setIsOpenModal: () => void;
  getDeletedPatients: () => void
  showDeleted: boolean
  setFilter: Dispatch<SetStateAction<string>>
}

export default function SearchUser({ setIsOpenModal, getDeletedPatients, showDeleted, setFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-4 items-center p-3 border-b border-gray-200/50 mb-6">
      <h2 className="font-extrabold text-xl sm:text-2xl text-foreground whitespace-nowrap">Pacientes</h2>
      <div className="flex-1 relative w-full sm:w-auto">
        <input 
          type="text" 
          placeholder="Filtrar por nome" 
          className="py-2 pl-10 pr-4 w-full rounded-xl bg-background-contrast border border-gray-300 text-sm focus:ring-2 focus:ring-color-blue focus:border-color-blue/50 transition duration-200" 
          onChange={e => setFilter(e.target.value)} 
        />
        <PiMagnifyingGlassLight className="absolute inset-y-0 left-3 my-auto text-gray-500" size={20} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
       <button
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition duration-200 w-full justify-center sm:w-auto cursor-pointer bg-dark-green`}
            onClick={getDeletedPatients}
          >
            {!showDeleted ? "Ver Pacientes Deletados" : "Ver Pacientes Ativos"}
          </button>
        <button 
          className="flex items-center gap-1 px-4 py-2 bg-ligth-green rounded-xl text-white cursor-pointer text-sm font-semibold shadow-md hover:bg-dark-green transition duration-200 w-full justify-center sm:w-auto" 
          onClick={setIsOpenModal}
        >
          <FiPlus className="text-lg" /> Novo Paciente
        </button>
      </div>
    </div>
  )
}