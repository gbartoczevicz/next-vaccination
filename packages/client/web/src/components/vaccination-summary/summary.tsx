import React, { useState, useEffect } from 'react';
import { Flex, Heading } from '@chakra-ui/react';

import { FilterButton, FilterButtonGroup } from '@/components';
import { VaccinationSummaryListing } from '@/components/vaccination-summary';

import { IVaccinationSummaryDTO } from '@/dtos';
import { httpClient } from '@/services';
import { useDateFilter } from '@/context/date-filter';

export const VaccinationSummary: React.FC = () => {
  const [summaries, setSummaries] = useState<IVaccinationSummaryDTO[]>([]);
  const { updatePeriod, period } = useDateFilter();

  useEffect(() => {
    httpClient
      .get<IVaccinationSummaryDTO[]>('/summaries', { params: { period } })
      .then((res) => setSummaries(res.data));
  }, [period]);

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" alignItems="center" mb="24">
        <Heading as="h3">Progresso de vacinação</Heading>

        <FilterButtonGroup>
          <>
            <FilterButton onClick={() => updatePeriod('TODAY')}>Hoje</FilterButton>
            <FilterButton onClick={() => updatePeriod('LAST_7_DAYS')}>Últimos 7 dias</FilterButton>
            <FilterButton onClick={() => updatePeriod('LAST_30_DAYS')}>Últimos 30 dias</FilterButton>
            <FilterButton onClick={() => updatePeriod('ALL_TIME')}>Todo tempo</FilterButton>
          </>
        </FilterButtonGroup>
      </Flex>

      <VaccinationSummaryListing summaries={summaries} />
    </Flex>
  );
};
