import React from 'react';

import { App, AppointmentsSummary, VaccinationSummary } from '@/components';
import { DateFilterProvider } from '@/context/date-filter';

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
