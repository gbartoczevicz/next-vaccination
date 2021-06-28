import React, { createContext, useState, useCallback, useContext } from 'react';

export enum Period {
  TODAY = 'TODAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  ALL_TIME = 'ALL_TIME'
}

interface IContext {
  period: Period;
  updatePeriod(toSet: Period): void;
}

const DateFilterContext = createContext<IContext>({} as IContext);

export const DateFilterProvider: React.FC = ({ children }) => {
  const [period, setPeriod] = useState<Period>(Period.TODAY);

  const updatePeriod = useCallback((toSet: Period) => setPeriod(toSet), []);

  return <DateFilterContext.Provider value={{ period, updatePeriod }}>{children}</DateFilterContext.Provider>;
};

export const useDateFilter = (): IContext => {
  const context = useContext(DateFilterContext);

  if (!context) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }

  return context;
};
