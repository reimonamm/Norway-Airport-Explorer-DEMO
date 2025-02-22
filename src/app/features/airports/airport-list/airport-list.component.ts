import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GoogleMapsService } from '../../../core/services/google-maps.service';
import { AirportsService } from '../../../core/services/airports.service';
import { Airport } from '../../../core/models/airport.model';
import { GoogleMapsModule } from '@angular/google-maps';

interface AirportWithLocation extends Airport {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-airport-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleMapsModule],
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.css']
})
export class AirportListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('airportItem') airportItems!: QueryList<ElementRef>;

  airports: AirportWithLocation[] = [];
  isLoading = true;
  highlightedAirport: AirportWithLocation | null = null;
  selectedAirportIndex: number | null = null;
  
  private map!: google.maps.Map;
  private markers: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map();

  constructor(
    private airportsService: AirportsService,
    private googleMapsService: GoogleMapsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAirports();
  }

  ngAfterViewInit(): void {
    this.googleMapsService.loadGoogleMaps().then(() => {
      this.initMap();
      
      const containerElement = document.querySelector('app-airport-list') as HTMLElement;
      if (containerElement) {
        containerElement.focus();
      }
    });
  }

  ngOnDestroy() {
    this.markers.forEach(marker => marker.map = null);
    this.markers.clear();
  }

  onContainerKeyDown(event: KeyboardEvent) {
    if (!this.airports.length) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.navigateAirports(event.key === 'ArrowDown' ? 1 : -1);
        return false;
      
      case 'Enter':
        if (this.selectedAirportIndex !== null) {
          event.preventDefault();
          event.stopPropagation();
          this.navigateToAirport(this.airports[this.selectedAirportIndex]);
        }
        return false;
    }

    return true;
  }

  private navigateAirports(direction: number) {
    // Select first or last airport
    if (this.selectedAirportIndex === null) {
      this.selectedAirportIndex = direction > 0 ? 0 : this.airports.length - 1;
    } else {
      let newIndex = this.selectedAirportIndex + direction;
      
      if (newIndex < 0) {
        newIndex = this.airports.length - 1;
      } else if (newIndex >= this.airports.length) {
        newIndex = 0;
      }
      
      this.selectedAirportIndex = newIndex;
    }

    const airport = this.airports[this.selectedAirportIndex];
    this.highlightAirport(airport);
    this.scrollToSelectedAirport();
  }

  private scrollToSelectedAirport() {
    if (this.selectedAirportIndex !== null && this.airportItems) {
      const airportItemArray = this.airportItems.toArray();
      const selectedElement = airportItemArray[this.selectedAirportIndex].nativeElement;
      
      selectedElement.focus();
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  private initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 64.5, lng: 11.5 },
      zoom: 5,
      mapId: 'b06c1e893dcdec9f',
      mapTypeId: 'terrain',
      scrollwheel: true,
      disableDoubleClickZoom: true,
      maxZoom: 15,
      minZoom: 4,
    });

    this.addMarkers();
  }

  private loadAirports() {
    this.airportsService.getNorwayAirports().subscribe({
      next: (airports) => {
        this.airports = airports.map(airport => ({
          ...airport,
          lat: (airport as any).lat || 0,
          lng: (airport as any).lng || 0
        }));
        this.isLoading = false;
        
        if (this.map) {
          this.addMarkers();
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  private addMarkers() {
    if (!this.map) {
      return;
    }

    this.markers.forEach(marker => marker.map = null);
    this.markers.clear();

    this.airports.forEach((airport) => {
      const pin = new google.maps.marker.PinElement({
        scale: this.isHighlighted(airport) ? 1.4 : 1,
        background: this.isHighlighted(airport) ? '#3b82f6' : '#64748b',
        borderColor: this.isHighlighted(airport) ? '#1d4ed8' : '#475569',
        glyphColor: '#ffffff'
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: airport.lat, lng: airport.lng },
        content: pin.element,
        map: this.map,
        title: airport.name
      });

      // Store marker reference
      this.markers.set(airport.iata, marker);

      // Click event - Navigate to airport details
      marker.addListener('click', () => this.navigateToAirport(airport));

      // Hover events for marker
      marker.addListener('mouseover', () => {
        this.highlightAirport(airport);
      });

      marker.addListener('mouseout', () => {
        this.resetHighlight();
      });
    });
  }

  private updateMarkerStyles() {
    this.airports.forEach(airport => {
      const marker = this.markers.get(airport.iata);
      if (marker) {
        const pin = new google.maps.marker.PinElement({
          scale: this.isHighlighted(airport) ? 1.4 : 1,
          background: this.isHighlighted(airport) ? '#3b82f6' : '#64748b',
          borderColor: this.isHighlighted(airport) ? '#1d4ed8' : '#475569',
          glyphColor: '#ffffff'
        });
        marker.content = pin.element;
      }
    });
  }

  private isHighlighted(airport: AirportWithLocation): boolean {
    return this.highlightedAirport?.iata === airport.iata;
  }

  navigateToAirport(airport: AirportWithLocation) {
    if (!airport || !airport.iata) {
      return;
    }
    const url = `/airports/${airport.iata}`;
    this.router.navigate(['/airports', airport.iata]);
  }

  highlightAirport(airport: AirportWithLocation) {
    this.highlightedAirport = airport;
    
    const index = this.airports.findIndex(a => a.iata === airport.iata);
    if (index !== -1) {
      this.selectedAirportIndex = index;
    }
    
    this.updateMarkerStyles();
  }
  
  resetHighlight() {
    this.highlightedAirport = null;
    this.selectedAirportIndex = null;
    this.updateMarkerStyles();
  }
}