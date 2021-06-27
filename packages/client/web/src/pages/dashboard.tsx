import React from 'react';

import { App, AppointmentsSummary, VaccinationSummary } from '@/components';
import { DateFilterProvider } from '@/contexts';

const DashBoard: React.FC = () => {
  return (
    <App>
      <DateFilterProvider>
        <>
          <VaccinationSummary />

          <AppointmentsSummary />
        </>
      </DateFilterProvider>
    </App>
  );
};

export default DashBoard;
