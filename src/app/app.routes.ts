import { Routes } from '@angular/router';
import { DeviceListComponent } from './components/devices/device-list/device-list.component';

export const routes: Routes = [
    {
        path: '',
        component: DeviceListComponent
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./components/devices/device-detail/device-detail.component').then(c => c.DeviceDetailComponent)
    },
    {
        path: '', redirectTo: 'products', pathMatch: 'full'
    },
    {
        path: '**', redirectTo: 'products'
    }
];
