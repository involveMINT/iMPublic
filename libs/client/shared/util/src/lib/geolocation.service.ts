import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { environment } from '@involvemint/shared/domain';

export interface LatLng2 {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private status: StatusService) { }

  getPosition(): Promise<LatLng2> {
    if (environment.environment === 'local') {
      return new Promise<LatLng2>((resolve) => {
        resolve({
          lat: 40.444229,
          lng: -79.943367
        });
      });
    }

    return new Promise<LatLng2>(async (resolve, reject) => {
      if (this.status) await this.status.showLoader('Getting Location...');
      navigator.geolocation.getCurrentPosition(
        async (resp) => {
          if (this.status) await this.status.dismissLoader();
          resolve({ lat: resp.coords.latitude, lng: resp.coords.longitude });
        },
        async (err) => {
          if (this.status) await this.status.dismissLoader();
          console.warn('Could not get current location: ', err);
          reject(err);
        }
      );
    });
  }

  parseLatLngAsString({ lat, lng }: LatLng2): string {
    return `${lat},${lng}`;
  }

  parseLatLngAsObj(latLng: string): LatLng2 {
    const parse = latLng.split(',');
    return { lat: Number(parse[0]), lng: Number(parse[1]) };
  }

  coordinateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'km' | 'miles' = 'miles'
  ): number {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 2 * (unit === 'km' ? 6371 : 3958.8) * Math.asin(Math.sqrt(a));
  }
}
