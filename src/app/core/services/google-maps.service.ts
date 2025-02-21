import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private apiKey = environment.googleMapsApiKey;
  private apiLoaded = false;

  loadGoogleMaps(): Promise<boolean> {
    if (this.apiLoaded) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      (window as any).googleMapsInit = () => {
        this.apiLoaded = true;
        resolve(true);
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=marker,places&callback=googleMapsInit`;
      script.async = true;
      script.defer = true;

      script.onerror = (error) => {
        console.error('Error loading Google Maps script', error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}