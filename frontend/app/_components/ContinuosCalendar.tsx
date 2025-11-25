'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import EventModal from './EventModal';
import usePatientAPI from '../_hooks/usePatientAPI';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import useAppontimentAPI from '../_hooks/useAppointmentAPI';
import DayCalendarModal from './DayCalendarModal';
import AppointmentModal from './PatientView/AppointmentModal';

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const ContinuousCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false)
  const [appointments, setAppointments] = useState<appointmentType[]>([]);
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [patientsData, setPartientsData] = useState<patientType[]>([]);
  const [selectedDay, setSelectedDay] = useState<{ date: Date; appointments: appointmentType[] } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<appointmentType | null>(null);
  const { getPatients } = usePatientAPI();
  const { getApponitments } = useAppontimentAPI();

  const colors = ["text-indigo-600", "text-teal-600", "text-pink-600", "text-lime-600", "text-red-600", "text-violet-600", "text-yellow-600", "text-blue-600", "text-rose-600"];

  const fetchPatients = async () => {
    const { data, error } = await getPatients();
    if (!error) setPartientsData(data);
  }
  const fetchAppointments = async () => {
    const { data, error } = await getApponitments();
    if (!error) setAppointments(data);
  }

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [])

  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute('data-month') === `${monthIndex}` &&
        ref.getAttribute('data-day') === `${dayIndex}`
    );

    const targetElement = dayRefs.current[targetDayIndex];
    if (!targetElement) return;

    const container = document.querySelector<HTMLDivElement>('.calendar-container');
    if (!container) return;

    const elementRect = targetElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const is2xl = window.matchMedia('(min-width: 1536px)').matches;
    const offsetFactor = is2xl ? 3 : 2.5;

    const offset =
      elementRect.top - containerRect.top - containerRect.height / offsetFactor + elementRect.height / 2;

    container.scrollTo({
      top: container.scrollTop + offset,
      behavior: 'smooth'
    });
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    setTimeout(() => {
      scrollToDay(today.getMonth(), today.getDate());
    }, 50);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToDay(today.getMonth(), today.getDate());
    }, 50);
  }, []);

  const indexedAppointments = useMemo(() => {
    return appointments.map((appointment, index) => ({
      ...appointment,
      sequentialIndex: index,
    }));
  }, [appointments]);

  const handleDeleteAppointment = (deletedAppointmentId: string) => {
    setSelectedAppointment(null);
    setIsModalUpdateOpen(false);

    setAppointments(currentAppointments => 
        currentAppointments.filter(appointment => appointment.appointmentId !== deletedAppointmentId)
    );

    setSelectedDay(prevSelectedDay => {
        if (!prevSelectedDay) {
            return null;
        }
        const updatedAppointments = prevSelectedDay.appointments.filter(
            appointment => appointment.appointmentId !== deletedAppointmentId
        );

        if (updatedAppointments.length === 0) {
            return null;
        }
        
        return {
            ...prevSelectedDay,
            appointments: updatedAppointments,
        };
    });
  };

  const generateCalendar = useMemo(() => {
    const today = new Date();
    const daysInYear = (): { month: number; day: number }[] => {
      const days: { month: number; day: number }[] = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();

      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ month: -1, day: 32 - startDayOfWeek + i });
      }

      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({ month, day });
        }
      }

      const lastWeekDayCount = days.length % 7;
      if (lastWeekDayCount > 0) {
        const extraDays = 7 - lastWeekDayCount;
        for (let i = 1; i <= extraDays; i++) {
          days.push({ month: 0, day: i });
        }
      }

      return days;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, dayIndex) => {
          const appointmentsInDay = indexedAppointments.filter(a => {
            const aDate = new Date(a.date);

            return (
              aDate.getUTCFullYear() === year &&
              aDate.getUTCMonth() === month &&
              aDate.getUTCDate() === day
            );
          }).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth =
            index === 0 || calendarDays[index - 1].month !== month;
          const isCurrentMonth = month !== -1;
          const isToday =
            today.getMonth() === month &&
            today.getDate() === day &&
            today.getFullYear() === year;
          const isThisMonth =
            today.getMonth() === month &&
            today.getFullYear() === year;

          if (month === -1) {
            return (
              <div
                key={`${month}-${day}`}
                className={`relative w-full size-40 m-0.5 border border-transparent bg-gray-50/10 rounded-xl`}
              />
            )
          }

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => { dayRefs.current[index] = el; }}
              data-month={month}
              data-day={day}
              className={`relative z-10 w-full min-h-40 max-h-40 overflow-hidden cursor-pointer font-medium m-0.5 shadow-sm transition-all duration-150 
                ${isToday 
                  ? 'bg-background-contrast border-ligth-green ring-2 ring-ligth-green/50' 
                  : 'bg-background hover:bg-background-contrast border-calendar'}
                rounded-xl text-sm border
              `}
              onClick={() =>
                setSelectedDay({
                  date: new Date(year, month, day),
                  appointments: appointmentsInDay
                })
              }
            >
              <span
                className={`absolute left-2 top-2 flex size-7 items-center justify-center rounded-full text-sm font-semibold 
                  ${isToday 
                    ? 'bg-ligth-green text-white' 
                    : isThisMonth 
                      ? 'text-foreground' 
                      : 'text-gray'}
                `}
              >
                {day}
              </span>

              {isNewMonth && (
                <span className={`absolute bottom-2 left-2 px-1.5 font-bold text-2xl text-foreground opacity-90 ${isToday && 'text-ligth-green'}`}>
                  {monthNames[month]}
                </span>
              )}

              <div className='flex flex-col mt-10 p-2'>
                {appointmentsInDay.length > 0 && appointmentsInDay.slice(0, 2).map((a) => {
                  const colorClass = colors[a.sequentialIndex % colors.length];
                  return (
                    <div className="flex items-center gap-1 overflow-hidden" key={a.appointmentId}>
                      <span className={`font-semibold text-xs ${colorClass} truncate`}>
                        {a.name.slice(0, 18)}{a.name.length > 18 && "..."}
                      </span>
                    </div>
                  )
                })}
                {appointmentsInDay.length > 2 && 
                  <span className="text-xs font-semibold text-gray">
                    + {appointmentsInDay.length - 2} Agendamentos
                  </span>
                }
              </div>
            </div>
          );
        })
        }
      </div >
    ));
  }, [year, appointments, indexedAppointments]);

  return (
    <div className="flex flex-col h-full rounded-t-2xl bg-background pb-6 shadow-2xl border border-background-contrast max-w-7xl mx-auto">
      
      <div className="sticky top-0 z-20 w-full rounded-t-2xl bg-background pt-6 px-8 border-b border-background-contrast shadow-sm">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTodayClick}
              type="button"
              className="rounded-xl bg-background-contrast px-4 py-2 text-sm font-semibold cursor-pointer text-foreground hover:bg-background-contrast/70 transition"
            >
              Hoje
            </button>

            <button
              type="button"
              className="whitespace-nowrap rounded-xl px-4 py-2 text-center text-sm font-semibold bg-ligth-green cursor-pointer text-white shadow-md hover:bg-green transition"
              onClick={() => setIsModalOpen(true)}
            >
              + Adicionar Evento
            </button>
          </div>

          <div className="flex w-fit items-center gap-4">
            <button onClick={handlePrevYear} className="rounded-full border border-calendar p-2 text-foreground hover:bg-background-contrast transition cursor-pointer">
              <FaArrowLeft className='size-3' />
            </button>

            <h1 className="min-w-16 text-center text-xl font-bold text-foreground">
              {year}
            </h1>

            <button onClick={handleNextYear} className="rounded-full border border-calendar p-2 text-foreground hover:bg-background-contrast transition cursor-pointer">
              <FaArrowRight className='size-3' />
            </button>
          </div>
        </div>

        <div className="grid w-full grid-cols-7 justify-between pt-1">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="w-full py-2 text-center font-bold text-gray uppercase text-xs sm:text-sm">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 scroll-style calendar-container max-h-[calc(100vh-18rem)]">
        {generateCalendar}
      </div>
      
      <EventModal isOpen={isModalOpen} setIsOpen={() => setIsModalOpen(false)} patients={patientsData} onSucess={() => fetchAppointments()}/>
      {selectedDay && (
        <DayCalendarModal
          isOpen={Boolean(selectedDay)}
          setIsOpen={() => setSelectedDay(null)}
          appointments={selectedDay.appointments}
          day={selectedDay.date}
          setModalUpdateOpen={setIsModalUpdateOpen}
          setAppointment={setSelectedAppointment}
        />
      )}
      {selectedAppointment && (
        <AppointmentModal 
          isOpen={isModalUpdateOpen} 
          setIsOpen={() => setIsModalUpdateOpen(false)} 
          patientId={selectedAppointment.patientId} 
          content={selectedAppointment} 
          appointments={appointments} 
          onDelete={() => handleDeleteAppointment(selectedAppointment.appointmentId)} 
        />
      )}
    </div>
  );
};