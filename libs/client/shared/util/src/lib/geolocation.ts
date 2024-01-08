import { StatusService } from './status.service';
import * as geocoder from 'node-geocoder';
import { environment } from '@involvemint/shared/domain';

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Gets the user's current location with loading screen
 * @param status StatusService to show loading screen
 */
export function getPosition(status?: StatusService) {

  if(environment.environment === 'local')
  {
    return {
      lat: 40.444229,
      lng: -79.943367
    }
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<LatLng>(async (resolve, reject) => {
    if (status) await status.showLoader('Getting Location...');
    navigator.geolocation.getCurrentPosition(
      async (resp) => {
        if (status) await status.dismissLoader();
        resolve({ lat: resp.coords.latitude, lng: resp.coords.longitude });
      },
      async (err) => {
        if (status) await status.dismissLoader();
        console.warn('Could not get current location: ', err);
        reject(err);
      }
    );
  });
}

export function parseLatLngAsString({ lat, lng }: LatLng) {
  return `${lat},${lng}`;
}

export function parseLatLngAsObj(latLng: string): LatLng {
  const parse = latLng.split(',');
  return { lat: Number(parse[0]), lng: Number(parse[1]) };
}

export function coordinateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'miles' = 'miles'
) {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 2 * (unit === 'km' ? 6371 : 3958.8) * Math.asin(Math.sqrt(a));
}

export async function getGeolocationOfAddress(address: string) : Promise<geocoder.Entry | null>
{
  if(environment.environment === 'local')
  {
    return null;
  }
  const geo = geocoder.default({ provider: 'google', apiKey: environment.gcpApiKey });
  const res = await geo.geocode(address);

  if(res.length === 1)
    return res[0];

  return null;
}
