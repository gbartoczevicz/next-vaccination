import React, { useEffect, useState } from 'react';
import { Flex, Heading, HStack } from '@chakra-ui/react';

import { IAppointmentDTO } from '@/dtos';
import { httpClient } from '@/services';
import { AppointmentsListing, FilterButton, FilterButtonGroup } from '@/components';
import { useDateFilter } from '@/context/date-filter';

export const AppointmentsSummary: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentDTO[]>([]);
  const { period } = useDateFilter();

  useEffect(() => {
    httpClient.get<IAppointmentDTO[]>('/appointments', { params: { period } }).then((res) => setAppointments(res.data));
  }, [period]);

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" alignItems="center" my="24">
        <Heading as="h3">Agendamentos</Heading>

        <FilterButtonGroup>
          <>
            <FilterButton>Pendentes</FilterButton>
            <FilterButton>Concluídos</FilterButton>
            <FilterButton>Cancelados</FilterButton>
            <FilterButton>Todos</FilterButton>
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
