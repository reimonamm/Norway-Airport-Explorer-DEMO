export interface Airport {
  iata: string;         
  name: string;     
  lat: number;      
  lng: number;      
}

export interface Departure {
  flight_iata?: string;   
  flight_number?: string;  
  arr_iata: string;      
  dep_time?: string;      
  scheduled_time?: string; 
  status?: string;       
}