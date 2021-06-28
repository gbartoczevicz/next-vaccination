import React, { useState, useEffect } from 'react';
import { Flex, Heading } from '@chakra-ui/react';

import { VaccinationSummaryListing, ButtonGroup } from '@/components';

import { IVaccinationSummaryDTO } from '@/dtos';
import { httpClient } from '@/services';
import { Period, useDateFilter } from '@/contexts';

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

        <ButtonGroup
          name="summaries_period_group"
          options={[
            { label: 'Hoje', value: Period.TODAY },
            { label: 'Últimos 7 dias', value: Period.LAST_7_DAYS },
            { label: 'Últimos 30 dias', value: Period.LAST_30_DAYS },
            { label: 'Todo tempo', value: Period.ALL_TIME }
          ]}
          onChange={updatePeriod}
        />
      </Flex>

      <VaccinationSummaryListing summaries={summaries} />
    </Flex>
  );
};
