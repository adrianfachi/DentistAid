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

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await getPatients();
      if (!error) setPartientsData(data);
    }
    const fetchAppointments = async () => {
      const { data, error } = await getApponitments();
      if (!error) setAppointments(data);
    }
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
          const isToday =
            today.getMonth() === month &&
            today.getDate() === day &&
            today.getFullYear() === year;
          const isMonth =
            today.getMonth() === month &&
            today.getFullYear() === year;



          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => { dayRefs.current[index] = el; }}
              data-month={month}
              data-day={day}
              className={`relative z-10 m-[-0.5px] w-full cursor-pointer rounded-xl font-medium hover:bg-background-standard size-40 border border-green`}
              onClick={() =>
                setSelectedDay({
                  date: new Date(year, month, day),
                  appointments: appointmentsInDay
                })
              }
            >
              <span
                className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${isMonth && 'bg-background-contrast'} ${isToday && 'bg-ligth-green font-semibold'}`}
              >
                {day}
              </span>

              {isNewMonth && (
                <span className="absolute bottom-2 px-1.5 font-semibold -mb-1 text-xl">
                  {monthNames[month]}
                </span>
              )}
              <div className='flex flex-col mt-12'>
                {appointmentsInDay.length > 0 && appointmentsInDay.slice(0, 2).map((a) => {
                  const colors = ["bg-ligth-green", "bg-dark-green", "bg-green"];
                  const bgClass = colors[a.sequentialIndex % 3];
                  return (
                    <span className={`top-10 left-2 px-1.5 ${bgClass} font-semibold text-sm`} key={a.appointmentId}>
                      {a.name.slice(0, 20)}{a.name.length > 20 && "..."}
                    </span>
                  )
                })}
                {appointmentsInDay.length > 2 && <span className={`top-10 left-2 px-1.5 bg-green font-semibold text-sm`}>
                  + {appointmentsInDay.length - 2}
                </span>}
              </div>
            </div>
          );
        })
        }
      </div >
    ));
  }, [year, appointments]);

  return (
    <div className="flex flex-col h-full max-h-full rounded-t-2xl bg-background pb-10 shadow-xl">
      <div className="sticky z-20 w-full rounded-t-2xl bg-background pt-7 px-8">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTodayClick}
              type="button"
              className="rounded-lg bg-ligth-green px-3 py-1.5 text-sm font-medium cursor-pointer"
            >
              Hoje
            </button>

            <button
              type="button"
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-center text-sm font-medium bg-green cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + Adicionar evento
            </button>
          </div>

          <div className="flex w-fit items-center justify-between">
            <button onClick={handlePrevYear} className="rounded-full border p-2 cursor-pointer">
              <FaArrowLeft />
            </button>

            <h1 className="min-w-16 text-center text-lg font-semibold">
              {year}
            </h1>

            <button onClick={handleNextYear} className="rounded-full border p-2 cursor-pointer">
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="grid w-full grid-cols-7 justify-between">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="w-full border-b py-2 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-5 max-h-[calc(100vh-18rem)] scroll-style calendar-container">
        {generateCalendar}
      </div>
      <EventModal isOpen={isModalOpen} setIsOpen={() => setIsModalOpen(false)} patients={patientsData} />
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
        <AppointmentModal isOpen={isModalUpdateOpen} setIsOpen={() => setIsModalUpdateOpen(false)} patientId={selectedAppointment.patientId} content={selectedAppointment} appointments={appointments} />
      )}
    </div>
  );
};
