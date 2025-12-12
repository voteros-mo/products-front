import { Injectable, inject } from '@angular/core';
import { DeviceStore } from './device-store';
import { Device } from '../../models/Device';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse {
  data: Device[];
  total: number;
  page: number;
  pageSize: number;
}

// Interfaz para la respuesta del API de producción (Spring Boot)
interface SpringPageResponse {
  content: any[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private store = inject(DeviceStore);
  private http = inject(HttpClient);
  private productsUrl = environment.apiUrl;

  loadDevices(page: number = 1, pageSize: number = 10): void {
    this.store.setLoading(true);

    let params: any;

    console.log('Environment:', environment);
    console.log('Using Spring Pagination:', environment.useSpringPagination);
    console.log('API URL:', this.productsUrl);

    if (environment.useSpringPagination) {
      // API de producción usa Spring Boot: page (0-indexed), size, sort
      params = {
        page: (page - 1).toString(), // Convertir de 1-indexed a 0-indexed
        size: pageSize.toString(),
        sort: 'name,asc'
      };
      console.log('Spring params:', params);
    } else {
      // json-server usa: _page, _limit
      params = {
        _page: page.toString(),
        _limit: pageSize.toString()
      };
      console.log('JSON-server params:', params);
    }

    if (environment.useSpringPagination) {
      // Manejar respuesta de Spring Boot
      this.http.get<SpringPageResponse>(this.productsUrl, { params }).subscribe({
        next: (response) => {
          console.log('Spring Boot response:', response);
          // Transformar de camelCase a snake_case
          const devices: Device[] = response.content.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            operating_system: item.operatingSystem,
            release_date: item.releaseDate,
            image_url: item.imageUrl
          }));
          console.log('Transformed devices:', devices);
          this.store.setDevices(devices, response.totalElements);
        },
        error: (error) => {
          console.error('Spring Boot error:', error);
          this.store.setError(error.message);
        }
      });
    } else {
      // Manejar respuesta de json-server
      this.http.get<Device[]>(this.productsUrl, {
        params,
        observe: 'response'
      }).subscribe({
        next: (response) => {
          console.log('JSON-server response:', response);
          const devices = response.body || [];
          const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);
          console.log('Devices:', devices, 'Total:', total);
          this.store.setDevices(devices, total);
        },
        error: (error) => {
          console.error('JSON-server error:', error);
          this.store.setError(error.message);
        }
      });
    }
  }

  addDevice(device: Omit<Device, 'id'>): void {
    // Transformar a camelCase si es necesario para el API de producción
    const payload = environment.useSpringPagination ? {
      name: device.name,
      brand: device.brand,
      price: device.price,
      operatingSystem: device.operating_system,
      releaseDate: device.release_date,
      imageUrl: device.image_url
    } : device;

    this.http.post<any>(this.productsUrl, payload).subscribe({
      next: () => {
        this.loadDevices(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error al crear dispositivo:', error);
      }
    });
  }

  updateDevice(id: string, device: Partial<Device>): void {
    // Transformar a camelCase si es necesario para el API de producción
    const payload = environment.useSpringPagination ? {
      ...(device.name && { name: device.name }),
      ...(device.brand && { brand: device.brand }),
      ...(device.price && { price: device.price }),
      ...(device.operating_system && { operatingSystem: device.operating_system }),
      ...(device.release_date && { releaseDate: device.release_date }),
      ...(device.image_url && { imageUrl: device.image_url })
    } : device;

    this.http.put<any>(`${this.productsUrl}/${id}`, payload).subscribe({
      next: () => {
        this.loadDevices(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error al actualizar dispositivo:', error);
      }
    });
  }

  deleteDevice(id: string): void {
    this.http.delete<void>(`${this.productsUrl}/${id}`).subscribe({
      next: () => {
        this.loadDevices(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error al eliminar dispositivo:', error);
      }
    });
  }

  constructor() {
    // Cargar dispositivos al iniciar
    this.loadDevices();
  }
}
