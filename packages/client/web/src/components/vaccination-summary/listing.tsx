import React from 'react';
import { Flex } from '@chakra-ui/react';

import { IVaccinationSummaryDTO } from '@/dtos';
import { VaccinationCardSummary } from '@/components/vaccination-summary';

type VaccinationSummaryListingProps = {
  summaries: Array<IVaccinationSummaryDTO>;
};

export const VaccinationSummaryListing: React.FC<VaccinationSummaryListingProps> = ({ summaries }) => (
  <Flex justifyContent="space-around">
    {summaries.map((summary) => (
      <VaccinationCardSummary summary={summary} />
    ))}
  </Flex>
);
