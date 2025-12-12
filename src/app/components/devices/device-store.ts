import { Injectable, signal, computed } from '@angular/core';
import { Device } from '../../models/Device';

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceStore {
  // Signals privadas para el estado
  private _devices = signal<Device[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _totalDevices = signal<number>(0);

  // Signals públicas de solo lectura
  readonly devices = this._devices.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly totalDevices = this._totalDevices.asReadonly();

  // Computed signals
  readonly devicesCount = computed(() => this._devices().length);
  readonly sortedDevices = computed(() => this._devices());

  // Métodos para actualizar el estado
  setDevices(devices: Device[], total?: number) {
    this._devices.set(devices);
    if (total !== undefined) {
      this._totalDevices.set(total);
    }
    this._loading.set(false);
    this._error.set(null);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
    this._error.set(null);
  }

  setError(error: string) {
    this._loading.set(false);
    this._error.set(error);
  }

  addDevice(device: Device) {
    this._devices.update(devices => [...devices, device]);
    this._loading.set(false);
    this._error.set(null);
  }

  updateDevice(id: string, updates: Partial<Device>) {
    this._devices.update(devices =>
      devices.map(d => d.id === id ? {...d, ...updates} : d)
    );
  }

  removeDevice(id: string) {
    this._devices.update(devices => devices.filter(d => d.id !== id));
  }
}
