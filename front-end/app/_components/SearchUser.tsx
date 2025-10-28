import { FiPlus } from "react-icons/fi"
import { PiMagnifyingGlassLight } from "react-icons/pi";

type Props = {}

export default function SearchUser({ }: Props) {
    return (
        <div className="flex w-full gap-2 p-3 items-center">
            <h2 className="font-medium text-[24px] opacity-80">Paciente</h2>
            <div className="flex-1 relative text-sm">
                <input type="text" placeholder="Filtrar por nome" className="p-1 pl-8 w-full rounded-lg" />
                <PiMagnifyingGlassLight className="absolute inset-0 top-1/2 -translate-y-1/2 left-2 text-gray-600" size={20} />
            </div>
            <button className="flex items-center px-3 py-2 bg-ligth-green rounded-lg text-white cursor-pointer text-sm"><FiPlus /> Novo Paciente</button>
        </div>
    )
}
