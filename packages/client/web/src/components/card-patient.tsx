import React from 'react';
import { Flex, Text, Avatar } from '@chakra-ui/react';
import {
  MdDateRange as Calendar,
  MdEventAvailable as AppointmentConcluded,
  MdEventBusy as CancelledAppointment
} from 'react-icons/md';

import { IAppointmentDTO } from '@/dtos';

type PatientCardProps = {
  appointment: IAppointmentDTO;
};

export const CardPatient: React.FC<PatientCardProps> = ({ appointment }) => {
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
              {isConcluded && <AppointmentConcluded />}
              {isCancelled && <CancelledAppointment />}
            </Text>
            <Text fontSize="lg">{isConcluded ? appointment.vaccinated_at : appointment.cancellated_at}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
