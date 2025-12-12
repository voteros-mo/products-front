import { Component, computed, inject, signal } from '@angular/core';
import { DeviceStore } from '../device-store';
import { DeviceService } from '../device.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent {

    private store = inject(DeviceStore);
    private deviceService = inject(DeviceService);

    // Signals para paginación
    pageIndex = signal(0);
    pageSize = signal(10);

    // Dispositivos directamente desde el store (paginación del servidor)
    paginatedDevices = this.store.devices;

    // Total desde el servidor
    totalDevices = this.store.totalDevices;

    hasDevices = computed(() => this.store.devices().length > 0);

    onPageChange(event: PageEvent): void {
      this.pageIndex.set(event.pageIndex);
      this.pageSize.set(event.pageSize);
      // Cargar página desde el servidor (json-server usa páginas base 1)
      this.deviceService.loadDevices(event.pageIndex + 1, event.pageSize);
    }

}
