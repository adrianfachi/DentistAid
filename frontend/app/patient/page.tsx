'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import usePatientAPI from "../_hooks/usePatientAPI"
import { ScaleLoader } from 'react-spinners';
import Body from '../_components/Body';
import PatientView from '../_components/PatientView/PatientView';

type PatientData = patientType | undefined;

function Patient() {
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState<PatientData>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get('search');
  const { getPatientById } = usePatientAPI();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const result = await getPatientById(query);
        setPatientData(result);
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        setPatientData(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [query, getPatientById])

  return (
    <Body activeNavBar='users'>
      {isLoading ? (
        <div className='flex items-center justify-center h-full'>
          <ScaleLoader
            color='var(--foreground)'
            height={20}
            width={4}
            radius={2}
            margin={2}
          />
        </div>
      ) : (
        <PatientView patient={patientData} />
      )}
    </Body>
  )
}

export default Patient;