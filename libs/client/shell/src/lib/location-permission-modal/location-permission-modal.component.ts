import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'location-permission-modal',
  templateUrl: './location-permission-modal.html',
  styleUrls: ['./location-permission-modal.scss'],
})
export class LocationPermissionModalComponent {
  permissionState: 'granted' | 'denied' | 'prompt' | 'unsupported' | 'loading' = 'loading';

  constructor(private readonly modal: ModalController) {}

  async ngOnInit(): Promise<void> {
    await this.checkLocationPermission();
  }

  async checkLocationPermission() {
    if ('permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        this.permissionState = permissionStatus.state;
      } catch (error) { console.error('Error checking location permission:', error); }
    } else { this.permissionState = 'unsupported'; }
  }

  close() {
    this.modal.dismiss();
  }

  async prompt() {
    if('geolocation' in navigator) navigator.geolocation.getCurrentPosition(
      async () => await this.checkLocationPermission(), 
      async () => await this.checkLocationPermission());
    // wait for user response
    
  }
}
