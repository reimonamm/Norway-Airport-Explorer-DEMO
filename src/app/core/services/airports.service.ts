import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Airport, Departure } from '../models/airport.model';
import { environment } from '../../../environments/environment';

//Single airport
interface AirportApiResponse {
  iata?: string;
  iata_code?: string; 
  name?: string;
  country?: string;
  country_code?: string;
  lat?: number;
  lng?: number;
}

//Api wrapper
interface ApiResponse<T> {
  response?: T[];
  error?: {
    message: string;
    code: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AirportsService {
  private airlabsApiKey = environment.airlabsApiKey;
  private apiBaseUrl = 'https://airlabs.co/api/v9';
  private AIRPORTS_STORAGE_KEY = 'norway_airports_data';

  constructor(private http: HttpClient) {}

  //AirportApiResponse -> Airport
  getNorwayAirports(): Observable<Airport[]> {
    const storedAirports = this.getStoredAirports();
    if (storedAirports && storedAirports.length > 0) {
      return of(storedAirports);
    }
  
    const params = new HttpParams().set('api_key', this.airlabsApiKey);
    return this.http.get<ApiResponse<AirportApiResponse>>(`${this.apiBaseUrl}/airports`, { params })
      .pipe(
        map(apiData => {
          const rawAirports = apiData.response || [];
          
          const norwegianAirports = rawAirports.filter((airport: AirportApiResponse) => 
            airport.country === 'Norway' || 
            airport.country === 'NO' || 
            airport.country_code === 'NO'
          );
          
          const simplifiedAirports = norwegianAirports.map((airport: AirportApiResponse): Airport => ({
            iata: airport.iata_code || airport.iata || '',
            name: airport.name || '',
            lat: airport.lat || 0,
            lng: airport.lng || 0
          }));
          
          const validAirports = simplifiedAirports.filter((airport: Airport) => airport.iata);
          return validAirports;
        }),
        
        tap(airports => {
          this.storeAirports(airports);
        }),
        catchError(error => {
          return([]);
        })
      );
  }

  private storeAirports(airports: Airport[]) {
    try {
      localStorage.setItem(
        this.AIRPORTS_STORAGE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          airports: airports
        })
      );
    } catch (error) {
    }
  }

  private getStoredAirports(): Airport[] | null {
    try {
      const storedData = localStorage.getItem(this.AIRPORTS_STORAGE_KEY);
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData);
      const ONE_HOUR = 60 * 60 * 1000;
      
      if (Date.now() - parsedData.timestamp > ONE_HOUR) {
        localStorage.removeItem(this.AIRPORTS_STORAGE_KEY);
        return null;
      }
      
      return parsedData.airports;
    } catch (error) {
      return null;
    }
  }

  getAirportByCode(iataCode: string): Observable<Airport | undefined> {
    if (!iataCode) {
      return of(undefined);
    }
    const normalizedCode = iataCode.trim().toUpperCase();
    
    return this.getNorwayAirports().pipe(
      map(airports => airports.find((airport: Airport) => 
        airport.iata && airport.iata.toUpperCase() === normalizedCode
      ))
    );
}

  getAirportDepartures(airportCode: string): Observable<Departure[]> {
    if (!airportCode) {
      return of([]);
    }

    const normalizedCode = airportCode.trim().toUpperCase(); 
    const params = new HttpParams()
      .set('api_key', this.airlabsApiKey)
      .set('dep_iata', normalizedCode)
      .set('limit', '5');  // Limit to 5 departures

    interface DepartureApiResponse {
      flight_iata?: string;
      flight_number?: string;
      dep_time?: string;
      arr_iata?: string;
      scheduled_time?: string;
      status?: string;
    }

    //typecheck api response
    return this.http.get<ApiResponse<DepartureApiResponse>>(`${this.apiBaseUrl}/schedules`, { params }).pipe(
      map(response => {
        const departures = response.response || [];
        return departures as Departure[];
      }),
      catchError(error => {
        return of([]);
      })
    );
  }
}