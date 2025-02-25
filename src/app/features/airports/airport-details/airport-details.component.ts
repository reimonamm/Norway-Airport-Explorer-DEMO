import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AirportsService } from '../../../core/services/airports.service';
import { Airport, Departure } from '../../../core/models/airport.model';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-airport-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './airport-details.component.html',
  styles: []
})
export class AirportDetailsComponent implements OnInit {
  airport: Airport | undefined;
  departures: Departure[] = [];
  isLoading = true;
  isLoadingDepartures = true;
  
  
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private airportsService: AirportsService
  ) {}
  
  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.loadAirport(code);
    } else {
      this.isLoading = false;
    }
  }
  
  loadAirport(code: string) {
    this.isLoading = true;
    this.airportsService.getNorwayAirports().subscribe({
      next: (airports) => {
        const matchingAirport = airports.find(a => 
          a.iata && a.iata.toUpperCase() === code.toUpperCase()
        );
        
        this.airport = matchingAirport;
        this.isLoading = false;
        
        if (matchingAirport) {
          this.loadAirportDepartures(code);
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }
  
  loadAirportDepartures(code: string) {
    this.isLoadingDepartures = true;
    this.airportsService.getAirportDepartures(code).subscribe({
      next: (departures) => {
        const scheduledDepartures = departures.filter(dep => 
          dep.status === 'scheduled' || !dep.status
        );
        
        //first 5 scheduled departures
        this.departures = scheduledDepartures.slice(0, 5);
        this.isLoadingDepartures = false;
      },
      error: (error) => {
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