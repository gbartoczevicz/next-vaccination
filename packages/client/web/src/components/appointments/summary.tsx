import React, { useEffect, useState } from 'react';
import { Flex, Heading, HStack, Code } from '@chakra-ui/react';

import { AppointmentStatus, IAppointmentDTO } from '@/dtos';
import { httpClient } from '@/services';
import { AppointmentsListing, FilterButton, FilterButtonGroup, ButtonGroup } from '@/components';
import { Period, useDateFilter } from '@/contexts';

export const AppointmentsSummary: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentDTO[]>([]);
  const [status, setStatus] = useState<AppointmentStatus>('PENDING');
  const { period, updatePeriod } = useDateFilter();

  useEffect(() => {
    httpClient
      .get<IAppointmentDTO[]>('/appointments', { params: { period, status } })
      .then((res) => setAppointments(res.data));
  }, [period, status]);

  return (
    <Flex direction="column">
      <Code colorScheme="yellow" color="black" width="fit-content">
        Current Status: {status} <br /> Current Period: {period}
      </Code>

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

      <ButtonGroup
        name="Teste"
        options={[
          { label: 'Hoje', value: Period.TODAY },
          { label: 'Últimos 7 dias', value: Period.LAST_7_DAYS },
          { label: 'Últimos 30 dias', value: Period.LAST_30_DAYS },
          { label: 'Todo tempo', value: Period.ALL_TIME }
        ]}
        onChange={updatePeriod}
      />

      <HStack spacing="12">
        <AppointmentsListing period="MORNING" appointments={appointments} />
        <AppointmentsListing period="EVENING" appointments={appointments} />
        <AppointmentsListing period="NIGHT" appointments={appointments} />
      </HStack>
    </Flex>
  );
};
