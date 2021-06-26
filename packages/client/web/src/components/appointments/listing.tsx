import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { IAppointmentDTO } from '@/dtos';
import { AppointmentCard } from '@/components/appointments';

type AppointmentsListingProps = {
  period: 'MORNING' | 'EVENING' | 'NIGHT';
  appointments: IAppointmentDTO[];
};

export const AppointmentsListing: React.FC<AppointmentsListingProps> = ({ appointments, period }) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    switch (period) {
      case 'MORNING':
        setLabel('Manhã');
        break;
      case 'EVENING':
        setLabel('Tarde');
        break;
      case 'NIGHT':
        setLabel('Noite');
        break;
      default:
        throw new Error(`Period is invalid ${period}`);
    }
  }, [period]);

  return (
    <Flex justifyContent="space-around">
      <Box alignItems="center" w="20rem">
        <Text fontSize="23">{label}</Text>
        {appointments.map((item) => (
          <AppointmentCard key={item.id} appointment={item} />
        ))}
      </Box>
    </Flex>
  );
};
