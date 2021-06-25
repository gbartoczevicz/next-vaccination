import React, { useState, useEffect } from 'react';
import { Flex, Box, Divider } from '@chakra-ui/react';

import { Navigation, VaccinationPointSummary, NotificationCollection } from '@/components';
import { IVaccinationPointSummaryDTO, NotificationCollectionDTO } from '@/dtos';
import { httpClient } from '@/services';

export const App: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationCollectionDTO>([]);
  const [vaccinationPoint, setVaccinationPoint] = useState<IVaccinationPointSummaryDTO>();

  useEffect(() => {
    httpClient.get<IVaccinationPointSummaryDTO>('/vaccination_point').then((res) => setVaccinationPoint(res.data));
    httpClient.get<NotificationCollectionDTO>('/notifications').then((res) => setNotifications(res.data));
  }, []);

  return (
    <Flex h="100vh" w="100vw">
      <Flex p="0 1.8rem 0 1.8rem" flexDirection="column" justifyContent="center" backgroundColor="white">
        <Navigation />
      </Flex>

      <Box flex="1" p="4rem 7.3rem 0px 7.3rem" overflowY="scroll" justifyContent="center">
        {children}
      </Box>

      <Box px="1.5rem" flex="0.3" alignItems="center" backgroundColor="white">
        <Flex marginTop="5rem" direction="column" alignItems="center">
          {vaccinationPoint && <VaccinationPointSummary summary={vaccinationPoint} />}
          <Divider w="15rem" background="#F5F8FA" />
          <NotificationCollection notifications={notifications} />
        </Flex>
      </Box>
    </Flex>
  );
};
