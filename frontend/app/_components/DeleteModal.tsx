'use client';

import { useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

type Props = {
  isOpen: boolean;
  setIsOpen: () => void;
  onDelete: () => void;
  isLoading: boolean;
}


function DeleteModal({ isOpen, setIsOpen, onDelete, isLoading }: Props) {
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

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={setIsOpen} />

      <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3">
        <p className='font-bold text-xl'>Tem certeza que quer excluir?</p>
        <div className='flex justify-center gap-2'>
          <div className="relative">
            <input type="button" value={!isLoading ? "Excluir" : ""} className='w-30 py-1 bg-red-400 text-red-800 rounded-lg cursor-pointer' onClick={onDelete} />

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
          <input type="button" value="Cancelar" className='w-30 py-1 bg-gray text-background rounded-lg cursor-pointer' onClick={setIsOpen} />
        </div>
      </div>
    </div>
  )
}

export default DeleteModal;