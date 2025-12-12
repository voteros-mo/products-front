import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DeviceService } from '../device.service';
import { CommonModule } from '@angular/common';
import { Device } from '../../../models/Device';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './device-dialog.component.html',
  styleUrl: './device-dialog.component.css'
})
export class DeviceDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private deviceService = inject(DeviceService);
  private dialogRef = inject(MatDialogRef<DeviceDialogComponent>);

  public deviceForm = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    operating_system: ['', Validators.required],
    release_date: [''],
    image_url: ['']
  });

  public isEditMode: boolean = false;
  public deviceId?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { device?: Device }) {
    if (data?.device) {
      this.isEditMode = true;
      this.deviceId = data.device.id;
    }
  }

  ngOnInit(): void {
    if (this.data?.device) {
      this.deviceForm.patchValue({
        name: this.data.device.name,
        brand: this.data.device.brand,
        price: this.data.device.price,
        operating_system: this.data.device.operating_system,
        release_date: this.data.device.release_date,
        image_url: this.data.device.image_url
      });
    }
  }

  onSubmit() {
    if (this.deviceForm.valid) {
      const deviceData = this.deviceForm.value as {
        name: string,
        brand: string,
        price: number,
        operating_system: string,
        release_date: string,
        image_url: string,
      };

      if (this.isEditMode && this.deviceId) {
        this.deviceService.updateDevice(this.deviceId, deviceData);
        this.dialogRef.close(true);
      } else {
        this.deviceService.addDevice(deviceData);
        this.dialogRef.close(true);
      }
    } else {
      Object.keys(this.deviceForm.controls).forEach(key => {
        const control = this.deviceForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
