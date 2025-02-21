export interface Airport {
  iata: string;
  icao?: string; // Optional as some airports might not have ICAO code
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Departure {
  flight_iata?: string;
  flight_number?: string;
  airline_iata?: string;
  airline_name?: string;
  arr_iata: string; // Arrival airport code
  arr_city?: string;
  
  dep_time?: string;
  scheduled_time?: string;
  estimated_time?: string;
  actual_time?: string;
  
  // Status information
  status?: string;


}