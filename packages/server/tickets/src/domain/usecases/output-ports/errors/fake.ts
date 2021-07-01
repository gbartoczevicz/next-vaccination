import { InfraError } from './infra';

export const makeInfraError = (message = 'Unexpected Error') => new InfraError(message);
