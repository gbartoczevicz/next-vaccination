import React, { useEffect, useState } from 'react';
import { Flex, Heading, HStack } from '@chakra-ui/react';

import { IAppointmentDTO } from '@/dtos';
import { httpClient } from '@/services';
import { AppointmentsListing } from '@/components/appointments';
import { DateFilterButton, DateFilterButtonGroup } from '@/components/date-filter';

export const AppointmentsSummary: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentDTO[]>([]);

  useEffect(() => {
    httpClient.get<IAppointmentDTO[]>('/appointments').then((res) => setAppointments(res.data));
  }, []);

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" alignItems="center" my="24">
        <Heading as="h3">Agendamentos</Heading>

        <DateFilterButtonGroup>
          <>
            <DateFilterButton>Pendentes</DateFilterButton>
            <DateFilterButton>Concluídos</DateFilterButton>
            <DateFilterButton>Cancelados</DateFilterButton>
            <DateFilterButton>Todos</DateFilterButton>
          </>
        </DateFilterButtonGroup>
      </Flex>

      <HStack spacing="12">
        <AppointmentsListing period="MORNING" appointments={appointments} />
        <AppointmentsListing period="EVENING" appointments={appointments} />
        <AppointmentsListing period="NIGHT" appointments={appointments} />
      </HStack>
    </Flex>
  );
};
