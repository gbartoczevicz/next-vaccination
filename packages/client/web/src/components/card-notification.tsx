import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import {
  MdEventBusy as CancelledAppointment,
  MdAddBox as Vector,
  MdPersonAdd as ProfessionalEnter
} from 'react-icons/md';
import { INotificationDTO, NotificationType } from '@/dtos/notification';

const selectIcon = (status: NotificationType): JSX.Element => {
  switch (status) {
    case 'APPOINTMENT_CANCELLED':
      return <CancelledAppointment color="red" />;
    case 'MEDIUM_STOCK':
      return <Vector color="#F9A826" />;
    case 'LOW_STOCK':
      return <Vector color="red" />;
    case 'FIRST_ACCESS':
      return <ProfessionalEnter color="#00BFA6" />;
    default:
      throw new Error(`Type not found ${String(status)}`);
  }
};

export const CardNotification: React.FC<INotificationDTO> = ({ type, content }) => {
  const [iconNotification, setIconNotification] = useState(null);

  useEffect(() => {
    const icon = selectIcon(type);
    setIconNotification(icon);
  }, []);

  return (
    <Flex borderRadius="8px" marginBottom="3" bg="#F5F8FA" w="80%" p="3" color="white">
      <Text h="100%" fontSize="2xl" marginRight="5">
        {iconNotification}
      </Text>
      <Text color="black" lineHeight="1" fontSize="md">
        {content}
      </Text>
    </Flex>
  );
};
