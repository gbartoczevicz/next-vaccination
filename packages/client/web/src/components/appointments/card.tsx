import React from 'react';
import { Flex, Avatar, Text } from '@chakra-ui/react';
import { MdDateRange as Calendar, MdEventAvailable as Concluded, MdEventBusy as Cancelled } from 'react-icons/md';

import { IAppointmentDTO } from '@/dtos';

type AppointmentCardProps = {
  appointment: IAppointmentDTO;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const isConcluded = appointment.vaccinated_at && !appointment.cancellated_at;
  const isCancelled = appointment.cancellated_at && !appointment.vaccinated_at;
  const isPending = !isConcluded && !isCancelled;

  return (
    <Flex
      color="#617480"
      flexDirection="column"
      maxWidth="17rem"
      minHeight="15rem"
      alignItems="center"
      borderRadius="8px"
      bg="white"
      p="5"
      marginTop="5"
    >
      <Avatar marginBottom="1rem" size="xl" name={appointment.patient.name} src={appointment.patient.avatar} />
      <Text as="strong">
        {appointment.patient.name} | {appointment.patient.id}
      </Text>
      <Text marginTop="2" fontSize="13px">{`${appointment.patient.phone} | ${appointment.patient.document}`}</Text>

      <Flex alignItems="center" marginTop="10" p="1rem">
        <Flex marginRight="10" alignItems="center">
          <Text fontSize="30px">
            <Calendar />
          </Text>
          <Text fontSize="lg">{appointment.date}</Text>
        </Flex>
        {!isPending && (
          <Flex color={isConcluded ? '#00BFA6' : '#F50057'} alignItems="center">
            <Text fontSize="30px">
              {isConcluded && <Concluded />}
              {isCancelled && <Cancelled />}
            </Text>
            <Text fontSize="lg">{isConcluded ? appointment.vaccinated_at : appointment.cancellated_at}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
