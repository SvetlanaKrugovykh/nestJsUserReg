import { Injectable } from '@nestjs/common';

@Injectable()
export class MapsService {
  [x: string]: any;
  private GOOGLE_MAPS_API_KEY: string;

  constructor() {
    this.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  }

  async calculateDistance(address1: string, address2: string): Promise<number> {
    const URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    const API_URL1 =
      URL +
      `?address=${encodeURIComponent(address1)}&key=` +
      this.GOOGLE_MAPS_API_KEY;
    const API_URL2 =
      URL +
      `?address=${encodeURIComponent(address2)}&key=` +
      this.GOOGLE_MAPS_API_KEY;

    const response1 = await fetch(API_URL1);
    const data1 = await response1.json();
    const response2 = await fetch(API_URL2);
    const data2 = await response2.json();

    try {
      const location1 = data1.results[0].geometry.location;
      const location2 = data2.results[0].geometry.location;

      const lat1 = location1.lat;
      const lng1 = location1.lng;
      const lat2 = location2.lat;
      const lng2 = location2.lng;

      const R = 6371e3; // metres
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;
      return distance;
    } catch (error) {
      console.log(error);
      throw new Error('Could not calculate distance');
    }
  }
}
