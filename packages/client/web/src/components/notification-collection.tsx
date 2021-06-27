import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { NotificationCollectionDTO } from '@/dtos';
import { CardNotification } from '@/components/card-notification';

type NotificationCollectionProps = {
  notifications: NotificationCollectionDTO;
};

export const NotificationCollection: React.FC<NotificationCollectionProps> = ({ notifications }) => (
  <Flex my="5" alignItems="center" w="95%" flexDirection="column">
    <Text fontSize="md" as="strong">
      Notificações
    </Text>
    <Flex m="2.5rem" w="100%" flexDirection="column" maxHeight="25rem" overflow="hidden">
      <Flex flexDirection="column" alignItems="center" overflow="auto" marginRight="-50px">
        {notifications.map(({ id, content, type }) => (
          <CardNotification key={id} id={id} type={type} content={content} />
        ))}
      </Flex>
    </Flex>
  </Flex>
);
