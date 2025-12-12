import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeviceDialogComponent } from './components/devices/device-dialog/device-dialog.component';
import { DeviceService } from './components/devices/device.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatDialogModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'products-front';
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private deviceService = inject(DeviceService); // Inyectar para inicializar el servicio

  openCreateDialog() {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }
}
