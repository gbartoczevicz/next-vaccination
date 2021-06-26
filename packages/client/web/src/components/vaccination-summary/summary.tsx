import React, { useState, useEffect } from 'react';
import { Flex, Heading } from '@chakra-ui/react';

import { FilterButton, FilterButtonGroup } from '@/components';
import { VaccinationSummaryListing } from '@/components/vaccination-summary';

import { IVaccinationSummaryDTO } from '@/dtos';
import { httpClient } from '@/services';

export const VaccinationSummary: React.FC = () => {
  const [summaries, setSummaries] = useState<IVaccinationSummaryDTO[]>([]);

  useEffect(() => {
    httpClient.get<IVaccinationSummaryDTO[]>('/summaries').then((res) => setSummaries(res.data));
  }, []);

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" alignItems="center" my="24">
        <Heading as="h3">Progresso de vacinação</Heading>

        <FilterButtonGroup>
          <>
            <FilterButton>Hoje</FilterButton>
            <FilterButton>Últimos 7 dias</FilterButton>
            <FilterButton>Últimos 30 dias</FilterButton>
            <FilterButton>Todo tempo</FilterButton>
          </>
        </FilterButtonGroup>
      </Flex>

      <VaccinationSummaryListing summaries={summaries} />
    </Flex>
  );
};
