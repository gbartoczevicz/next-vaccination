import React, { useEffect, useState } from 'react';
import { Flex, Heading, HStack } from '@chakra-ui/react';

import { AppointmentStatus, IAppointmentDTO } from '@/dtos';
import { httpClient } from '@/services';
import { AppointmentsListing, ButtonGroup } from '@/components';
import { useDateFilter } from '@/contexts';

export const AppointmentsSummary: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentDTO[]>([]);
  const [status, setStatus] = useState<AppointmentStatus>(AppointmentStatus.PENDING);
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

        <ButtonGroup
          name="appointment_status_group"
          options={[
            { label: 'Pendentes', value: AppointmentStatus.PENDING },
            { label: 'Concluídos', value: AppointmentStatus.CONCLUDED },
            { label: 'Cancelados', value: AppointmentStatus.CANCELLED },
            { label: 'Todos', value: AppointmentStatus.ALL }
          ]}
          onChange={setStatus}
        />
      </Flex>

      <HStack spacing="12">
        <AppointmentsListing period="MORNING" appointments={appointments} />
        <AppointmentsListing period="EVENING" appointments={appointments} />
        <AppointmentsListing period="NIGHT" appointments={appointments} />
      </HStack>
    </Flex>
  );
};
