import { Component, inject, signal } from '@angular/core';
import { Device } from '../../../models/Device';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceStore } from '../device-store';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeviceService } from '../device.service';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDialogComponent } from '../device-dialog/device-dialog.component';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent {
  device = signal<Device | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(DeviceStore);
  private deviceService = inject(DeviceService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const deviceFound = this.store.devices().find((d: { id: string | null; })  => d.id === id);
    this.device.set(deviceFound);
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onEdit(): void {
    if (this.device()) {
      const dialogRef = this.dialog.open(DeviceDialogComponent, {
        width: '500px',
        data: { device: this.device() }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Actualizar los datos del dispositivo mostrado desde el store
          const id = this.route.snapshot.paramMap.get('id');
          const updatedDevice = this.store.devices().find((d: { id: string | null; }) => d.id === id);
          this.device.set(updatedDevice);
        }
      });
    }
  }

  onDelete(): void {
    if (this.device()) {
      const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar ${this.device()!.name}?`);
      if (confirmDelete) {
        this.deviceService.deleteDevice(this.device()!.id);
        this.router.navigate(['/']);
      }
    }
  }
}
