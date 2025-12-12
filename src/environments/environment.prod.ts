import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: '/api/v1/products', // Usar proxy para evitar CORS en desarrollo
  useSpringPagination: true // API de producción usa Spring Boot pagination
};
