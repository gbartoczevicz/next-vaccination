import { httpClient } from '@/services/http-client';
import { IPatientDTO } from '@/dtos/patient';

export const fetchPatients = async (): Promise<IPatientDTO[]> => {
  try {
    const { data } = await httpClient.get<IPatientDTO[]>('/patients');

    return data;
  } catch (err) {
    console.error('Fetch Patients', err.message);

    return null;
  }
};
