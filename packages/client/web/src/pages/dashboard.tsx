import React from 'react';

import { App, AppointmentsSummary, VaccinationSummary } from '@/components';

const DashBoard: React.FC = () => {
  return (
    <App>
      <VaccinationSummary />

      <AppointmentsSummary />
    </App>
  );
};

export default DashBoard;
