import React, { useState, useEffect } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { MdFavorite as Heart } from 'react-icons/md';

import { IVaccinationSummaryDTO } from '@/dtos';

type VaccinationCardSummaryProps = {
  summary: IVaccinationSummaryDTO;
};

export const VaccinationCardSummary: React.FC<VaccinationCardSummaryProps> = ({ summary }) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    switch (summary.age_group) {
      case 'ALL':
        setLabel('Total');
        break;
      case 'ELDERLY':
        setLabel('Idosos');
        break;
      case 'ADULT':
        setLabel('Adultos');
        break;
      case 'YOUNG':
        setLabel('Jovens');
        break;
      default:
        throw new Error(`Age Group is invalid ${summary.age_group}`);
    }
  }, [summary]);

  return (
    <Flex direction="column" borderRadius="md" color="#617480" bgColor="white" height="8rem" width="20rem" p="6">
      <Flex paddingLeft="5" alignItems="center" fontSize="23" mb="2">
        <Heart size="23" />
        <Text marginLeft="5" fontSize="xl">
          {label}
        </Text>
      </Flex>
      <Flex alignItems="flex-end" justifyContent="space-between" px="6">
        <Heading>{summary.appointments.percentage}%</Heading>
        <Text fontSize="26">
          {summary.appointments.pending}/{summary.appointments.concluded}
        </Text>
      </Flex>
    </Flex>
  );
};
