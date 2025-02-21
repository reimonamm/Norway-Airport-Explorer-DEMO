import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AirportsService } from '../../../core/services/airports.service';
import { Airport, Departure } from '../../../core/models/airport.model';



@Component({
  selector: 'app-airport-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="container mx-auto p-4" 
      role="region" 
      aria-labelledby="airport-details-heading"
    >
      <div *ngIf="isLoading" class="text-center p-8" aria-live="polite">
        <div 
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4" 
          aria-hidden="true"
        ></div>
        <p>Loading airport details...</p>
      </div>
      
      <div *ngIf="!isLoading && airport" class="space-y-4">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 
            id="airport-details-heading" 
            class="text-2xl font-bold mb-2"
            tabindex="0"
          >
            {{ airport.name }}
          </h1>
          <p class="text-sm text-gray-500">IATA: {{ airport.iata }}</p>
          <p *ngIf="airport.icao" class="text-sm text-gray-500">ICAO: {{ airport.icao }}</p>
        </div>
        
        <div class="bg-white shadow rounded-lg p-6">
          <h2 
            class="text-xl font-semibold mb-4" 
            id="departures-heading"
            tabindex="0"
          >
            Next Departures
          </h2>
          
          <div 
            *ngIf="isLoadingDepartures" 
            class="text-center py-4" 
            aria-live="polite"
          >
            <div 
              class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"
              aria-hidden="true"
            ></div>
            <p>Loading departures...</p>
          </div>
          
          <div 
            *ngIf="!isLoadingDepartures && departures.length === 0" 
            class="text-center text-gray-500 py-4"
            aria-live="polite"
          >
            No upcoming departures found.
          </div>
          
          <table 
            *ngIf="departures.length > 0" 
            class="w-full" 
            aria-labelledby="departures-heading"
          >
            <thead>
              <tr class="border-b">
                <th class="text-left p-2">Flight</th>
                <th class="text-left p-2">Destination</th>
                <th class="text-left p-2">Scheduled Time</th>
                <th class="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let departure of departures" 
                class="border-b hover:bg-gray-50"
                tabindex="0"
              >
                <td class="p-2">{{ departure.flight_iata || departure.flight_number }}</td>
                <td class="p-2">{{ departure.arr_iata }}</td>
                <td class="p-2">{{ formatTime(departure.scheduled_time || departure.dep_time) }}</td>
                <td class="p-2">{{ departure.status || 'Scheduled' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6">
          <button 
            (click)="goBack()" 
            aria-label="Go back to airports list"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Airports
          </button>
        </div>
      </div>
      
      <div 
        *ngIf="!isLoading && !airport" 
        class="bg-red-50 border-l-4 border-red-500 p-4 my-4"
        role="alert"
      >
        <div class="flex flex-col">
          <div class="ml-3">
            <p class="text-red-700 font-medium">Airport not found.</p>
            <button 
              (click)="goBack()" 
              aria-label="Go back to airports list"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Back to Airports
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AirportDetailsComponent implements OnInit {
  airport: Airport | undefined;
  departures: Departure[] = [];
  isLoading = true;
  isLoadingDepartures = true;
  
  // Debugging properties
  currentUrl = '';
  routeCode: string | null = null;
  paramMapKeys = '';
  routeSegments = '';
  
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private airportsService: AirportsService
  ) {}
  
  ngOnInit() {
    // Get the route parameter once on init
    const code = this.route.snapshot.paramMap.get('code');
    this.routeCode = code;
    
    // Debug information
    this.currentUrl = this.router.url;
    this.paramMapKeys = this.route.snapshot.paramMap.keys.join(', ') || 'none';
    
    // If we have a code, load the airport data
    if (code) {
      this.loadAirportWithCode(code);
    } else {
      console.error('No airport code found in route parameters');
      this.isLoading = false;
    }
  }
  
  loadAirportWithCode(code: string) {
    // Reset loading state when loading a new airport
    this.isLoading = true;
    
    // First get all airports to check if the code exists
    this.airportsService.getNorwayAirports().subscribe({
      next: (airports) => {
        console.log('All airports loaded, count:', airports.length);
        console.log('Available airport codes:', airports.map(a => a.iata).join(', '));
        
        // Try to find the airport directly
        const matchingAirport = airports.find(a => 
          a.iata && a.iata.toUpperCase() === code.toUpperCase()
        );
        
        if (matchingAirport) {
          console.log('Found matching airport directly:', matchingAirport);
          this.airport = matchingAirport;
          this.isLoading = false;
          this.loadAirportDepartures(code);
        } else {
          // If not found directly, try through the service method
          console.log('No direct match found, trying through service...');
          this.loadAirportDetails(code);
        }
      },
      error: (error) => {
        console.error('Error loading airports list', error);
        this.loadAirportDetails(code); // Fall back to normal loading
      }
    });
  }
  
  loadAirportDetails(code: string) {
    console.log('Loading airport details for code:', code);
    this.airportsService.getAirportByCode(code).subscribe({
      next: (airport) => {
        this.airport = airport;
        this.isLoading = false;
        console.log('Airport details loaded through service:', airport);
        
        if (airport) {
          this.loadAirportDepartures(code);
        }
      },
      error: (error) => {
        console.error('Error loading airport details', error);
        this.isLoading = false;
      }
    });
  }
  
  loadAirportDepartures(code: string) {
    console.log('Loading departures for code:', code);
    this.isLoadingDepartures = true;
    this.airportsService.getAirportDepartures(code).subscribe({
      next: (departures) => {
        // Filter to only include scheduled (upcoming) departures
        const scheduledDepartures = departures.filter(dep => 
          dep.status === 'scheduled' || !dep.status
        );
        
        // Take only the first 5 scheduled departures
        this.departures = scheduledDepartures.slice(0, 5);
        this.isLoadingDepartures = false;
        console.log('Next 5 scheduled departures loaded:', this.departures);
      },
      error: (error) => {
        console.error('Error loading departures', error);
        this.isLoadingDepartures = false;
      }
    });
  }
  
  formatTime(time: string | Date | undefined): string {
    if (!time) return 'N/A';
    
    try {
      const date = new Date(time);
      return date.toLocaleString();
    } catch (e) {
      return String(time);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Backspace':
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.goBack();
        break;
    }
  }

  goBack() {
    this.router.navigate(['/airports']);
  }
  
  jsonStringify(obj: any): string {
    return JSON.stringify(obj);
  }

  
}