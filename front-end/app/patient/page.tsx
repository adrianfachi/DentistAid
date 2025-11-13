'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import usePatientAPI from "../_hooks/usePatientAPI"
import { ScaleLoader } from 'react-spinners';
import Body from '../_components/Body';
import PatientView from '../_components/PatientView';


function Patient() {
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState<PatientData>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get('search');
  const { getPatientById } = usePatientAPI();

  type PatientData = patientType | undefined;

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
        <ScaleLoader
          color='var(--foreground)'
          height={20}
          width={4}
          radius={2}
          margin={2}
        />
      ) : (
        <PatientView patient={patientData} />
      )}
    </Body>
  )
}

export default Patient;