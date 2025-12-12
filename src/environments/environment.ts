import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000/products',
  useSpringPagination: false // json-server usa paginación simple
};
