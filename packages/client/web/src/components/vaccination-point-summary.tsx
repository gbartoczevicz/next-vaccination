import React from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

import { IVaccinationPointSummaryDTO } from '@/dtos/vaccination-point';

type VaccinationPointSummaryProps = {
  summary: IVaccinationPointSummaryDTO;
};

export const VaccinationPointSummary: React.FC<VaccinationPointSummaryProps> = ({ summary }) => (
  <>
    <Box backgroundColor="white">
      <Avatar size="2xl" name={summary.name} src={summary.avatar} />{' '}
    </Box>
    <Flex my="5" backgroundColor="white" alignItems="center" flexDirection="column">
      <Text as="strong">{summary.name}</Text>
      <Text as="h2">{summary.responsible.name}</Text>
    </Flex>
  </>
);
