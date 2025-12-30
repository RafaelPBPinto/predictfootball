import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Team } from "../models/team";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(`${this.apiServerUrl}/team`);
    }
}
