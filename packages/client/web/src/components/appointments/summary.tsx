import React, { useEffect, useState } from 'react';
import { Flex, Heading, HStack } from '@chakra-ui/react';

import { AppointmentStatus, IAppointmentDTO } from '@/dtos';
import { httpClient } from '@/services';
import { AppointmentsListing, FilterButton, FilterButtonGroup } from '@/components';
import { useDateFilter } from '@/context/date-filter';

export const AppointmentsSummary: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentDTO[]>([]);
  const [status, setStatus] = useState<AppointmentStatus>('PENDING');
  const { period } = useDateFilter();

  useEffect(() => {
    httpClient
      .get<IAppointmentDTO[]>('/appointments', { params: { period, status } })
      .then((res) => setAppointments(res.data));
  }, [period, status]);

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" alignItems="center" my="24">
        <Heading as="h3">Agendamentos</Heading>

        <FilterButtonGroup>
          <>
            <FilterButton onClick={() => setStatus('PENDING')}>Pendentes</FilterButton>
            <FilterButton onClick={() => setStatus('CONCLUDED')}>Concluídos</FilterButton>
            <FilterButton onClick={() => setStatus('CANCELLED')}>Cancelados</FilterButton>
            <FilterButton onClick={() => setStatus('ALL')}>Todos</FilterButton>
          </>
        </FilterButtonGroup>
      </Flex>

      <HStack spacing="12">
        <AppointmentsListing period="MORNING" appointments={appointments} />
        <AppointmentsListing period="EVENING" appointments={appointments} />
        <AppointmentsListing period="NIGHT" appointments={appointments} />
      </HStack>
    </Flex>
  );
};
