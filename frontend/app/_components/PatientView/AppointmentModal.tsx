'use client';

import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdClose } from 'react-icons/md'
import toast from 'react-hot-toast';
import useAppontimentAPI from '@/app/_hooks/useAppointmentAPI';
import FormInput from '../FormInput'
import { appointmentValidateSchema } from "../../_utils/appointmentValidade";
import DeleteModal from '../DeleteModal';
import { ScaleLoader } from 'react-spinners';

type Props = {
  isOpen: boolean
  setIsOpen: () => void
  appointments?: appointmentType[]
  patientId: number
  patientName?: string
  content?: appointmentType
  onDelete?: () => void
}

type FormType = {
  name?: string | undefined;
  date: string;
  startsAt: string;
  endsAt: string;
}

function AppointmentModal({ isOpen, setIsOpen, appointments = [], patientId, patientName, content, onDelete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { createAppointment, updateAppointment, deleteAppointment } = useAppontimentAPI()
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(appointmentValidateSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: content?.name || '',
      date: content?.date || '',
      startsAt: content?.startsAt || '',
      endsAt: content?.endsAt || ''
    }
  });

  useEffect(() => {
    if (content) {
      reset({
        name: content.name || '',
        date: content.date || '',
        startsAt: content.startsAt || '',
        endsAt: content.endsAt || ''
      });
    }
  }, [content, reset]);


  const postAppointment = async (data: FormType) => {
    setIsLoading(true);
    try {

      const dateISO = new Date(data.date).toISOString().split('T')[0];
      const fullStartsAt = `${dateISO}T${data.startsAt}:00.000`;
      const fullEndsAt = `${dateISO}T${data.endsAt}:00.000`;


      const commonBody: newAppointmentType = {
        patientId: patientId,
        name: data.name ? data.name : `Consulta ${patientName} nº ${appointments.length + 1}`,
        date: dateISO,
        startsAt: fullStartsAt,
        endsAt: fullEndsAt,
      };

      if (content) {
        // Atualizar Consulta
        const { error } = await updateAppointment(content.appointmentId, commonBody);
        if (error) {
          let messageError = "Erro ao alterar consulta";

          if (error === "Error: appointment already scheduled at this time.") {
            messageError = "Já existe uma consulta nesse horário";
          } else if (error === "Error: Appointment date must be today or in the future.") {
            messageError = "Você não pode criar uma consulta no passado";
          }

          toast.error(messageError, { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        } else {
          toast.success("Consulta alterada com sucesso!", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
          reset();
          setIsOpen();
        }
      } else {
        // Criar Nova Consulta
        const { error } = await createAppointment(commonBody);
        if (error) {
          let messageError = "Erro ao criar consulta";

          if (error === "Error: appointment already scheduled at this time.") {
            messageError = "Já existe uma consulta nesse horário";
          } else if (error === "Error: Appointment date must be today or in the future.") {
            messageError = "Você não pode criar uma consulta no passado";
          }

          toast.error(messageError, { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        } else {
          toast.success("Consulta criada com sucesso!", {
            style: { backgroundColor: "var(--background)", color: "var(--foreground)" }
          })
          reset();
          setIsOpen();
        }
      }

    } catch (error) {
      console.error("Erro na submissão:", error);
      toast.error("Erro inesperado ao criar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppointmentHandle = async () => {
    setIsLoadingDelete(true);
    try {

      const { error } = await deleteAppointment(content?.appointmentId!);

      if (error) {
        toast.error("Erro ao deletar consulta", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Consulta deletada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        onDelete && onDelete()
        setIsOpenModalDelete(false)
        setIsOpen()
      }

    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
    } finally {
      setIsLoadingDelete(false);
    }
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={setIsOpen} />
      
      <div className="relative p-6 bg-background rounded-xl shadow-2xl flex flex-col gap-5 w-full max-w-lg">
        
        <MdClose 
          onClick={setIsOpen} 
          className="absolute right-4 top-4 cursor-pointer text-3xl text-foreground hover:text-red-500 transition" 
        />
        
        <h1 className='font-extrabold text-2xl border-b pb-2'>{content ? 'Editar Consulta' : 'Nova Consulta'}</h1>

        <form onSubmit={handleSubmit(postAppointment)} className="flex flex-col gap-4">
          
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <FormInput
                id="date"
                label="Data da Consulta"
                placeHolder="Ex: 22/09/2025"
                initialValue={content?.date}
                type="date"
                {...field}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                id='eventName'
                label='Nome da Consulta (opcional)'
                initialValue={content?.name}
                placeHolder={`Consulta ${patientName} nº ${appointments.length + 1}`}
                type="text"
                {...field}
                error={errors.name?.message}
              />
            )}
          />

          <div className='flex gap-4'>
            <Controller
              name="startsAt"
              control={control}
              render={({ field }) => (
                <FormInput
                  id="initialTime"
                  label="Início"
                  placeHolder="09:00"
                  type="text"
                  isTimeInput={true}
                  typeMask='time'
                  initialValue={content?.startsAt}
                  {...field}
                  error={errors.startsAt?.message}
                  className="flex-1"
                />
              )}
            />
            <Controller
              name="endsAt"
              control={control}
              render={({ field }) => (
                <FormInput
                  id="endTime"
                  label="Fim"
                  placeHolder="10:00"
                  type="text"
                  isTimeInput={true}
                  typeMask='time'
                  initialValue={content?.endsAt}
                  {...field}
                  error={errors.endsAt?.message}
                  className="flex-1"
                />
              )}
            />
          </div>
          
          <div className='flex justify-end pt-3 gap-3'>
            {content && (
              <input 
                type="button" 
                value="Deletar Consulta" 
                className='bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold shadow-md hover:bg-red-700 transition' 
                onClick={() => setIsOpenModalDelete(true)} 
              />
            )}
            
            <div className='relative'>
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`
                    w-48 py-2 rounded-lg font-semibold transition duration-200 shadow-md
                    ${isLoading
                      ? 'bg-green cursor-not-allowed text-transparent'
                      : 'bg-green text-white cursor-pointer hover:bg-green/90'
                    }
                  `}
              >
                {content ? "Atualizar Consulta" : "Cadastrar Consulta"}
              </button>
              
              {isLoading && (
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
          </div>
        </form>
      </div>
      
      <DeleteModal 
        isLoading={isLoadingDelete} 
        isOpen={isOpenModalDelete} 
        onDelete={() => deleteAppointmentHandle()} 
        setIsOpen={() => setIsOpenModalDelete(false)} 
      />
    </div>
  )
}

export default AppointmentModal