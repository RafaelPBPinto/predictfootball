import { Component, OnInit, signal } from '@angular/core';
import { Club } from './club';
import { ClubService } from './club.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  public clubs = signal<Club[]>([]);

  constructor(private clubService: ClubService) { }

  ngOnInit(): void {
    this.getClubs();
  }

  public getClubs(): void {
    this.clubService.getClubs().subscribe(
      {
        next: (response: Club[]) => {
          console.log(response)
          this.clubs.set(response);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      });
  }
}
