import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Airport, Departure } from '../models/airport.model';
import { environment } from '../../../environments/environment';

interface AirportApiResponse {
  iata?: string;
  iata_code?: string; 
  name?: string;
  country?: string;
  country_code?: string;
  lat?: number;
  lng?: number;
}

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

  getNorwayAirports(): Observable<Airport[]> {
    // Airports from storage
    const storedAirports = this.getStoredAirports();
    if (storedAirports && storedAirports.length > 0) {
      return of(storedAirports);
    }

    // Api call
    const params = new HttpParams()
      .set('api_key', this.airlabsApiKey);

    return this.http.get<ApiResponse<AirportApiResponse>>(`${this.apiBaseUrl}/airports`, { params }).pipe(
      map(response => {
        const airports = (response.response || [])
          .filter((airport: AirportApiResponse) => 
            airport.country === 'Norway' || 
            airport.country === 'NO' || 
            airport.country_code === 'NO'
          )
          .map((airport: AirportApiResponse): Airport => ({
        
            iata: airport.iata_code || airport.iata || '',
            name: airport.name || '',
            lat: airport.lat || 0,
            lng: airport.lng || 0
          }));
        
        // Filter out airports without IATA codes
        const validAirports = airports.filter((airport: Airport) => airport.iata);
        console.log(`Found ${validAirports.length} valid Norwegian airports`);
        
        return validAirports;
      }),
      tap(airports => {
        // Store airports in localStorage
        this.storeAirports(airports);
      }),
      catchError(error => {
        console.error('Error fetching airports:', error);
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
      console.error('Error storing airports in localStorage:', error);
    }
  }

  private getStoredAirports(): Airport[] | null {
    try {
      const storedData = localStorage.getItem(this.AIRPORTS_STORAGE_KEY);
      if (!storedData) return null;

      const parsedData = JSON.parse(storedData);

      const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - parsedData.timestamp > SIX_MONTHS) {
        localStorage.removeItem(this.AIRPORTS_STORAGE_KEY);
        return null;
      }

      return parsedData.airports;
    } catch (error) {
      console.error('Error retrieving airports from localStorage:', error);
      return null;
    }
  }

  getAirportByCode(iataCode: string): Observable<Airport | undefined> {
    if (!iataCode) {
      console.error('Empty IATA code provided');
      return of(undefined);
    }

    const normalizedCode = iataCode.trim().toUpperCase();
    console.log(`Looking up airport with normalized code: ${normalizedCode}`);
    
    return this.getNorwayAirports().pipe(
      tap(airports => {
        console.log(`Checking among ${airports.length} airports`);
        console.log('Available airport codes:', airports.map(a => a.iata));
      }),
      map(airports => {
        const airport = airports.find((airport: Airport) => 
          airport.iata && airport.iata.toUpperCase() === normalizedCode
        );
        
        if (!airport) {
          console.warn(`No airport found with code ${normalizedCode}`);
        } else {
          console.log(`Found airport: ${airport.name}`);
        }
        
        return airport;
      })
    );
  }

  getAirportDepartures(airportCode: string): Observable<Departure[]> {
    if (!airportCode) {
      return of([]);
    }

    const normalizedCode = airportCode.trim().toUpperCase();
    console.log(`Fetching departures for airport: ${normalizedCode}`);
    
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

    return this.http.get<ApiResponse<DepartureApiResponse>>(`${this.apiBaseUrl}/schedules`, { params }).pipe(
      map(response => {
        const departures = response.response || [];
        console.log(`Received ${departures.length} departures`);
        return departures as Departure[];
      }),
      catchError(error => {
        console.error('Error fetching departures:', error);
        return of([]);
      })
    );
  }
}