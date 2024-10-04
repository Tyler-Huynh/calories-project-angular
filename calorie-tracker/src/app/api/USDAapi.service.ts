import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class USDAApiService {

  private baseUrl = "https://api.nal.usda.gov/fdc/v1/foods/search";
  private apiKey = "f5TEEKlC3bvcTgjyEUJde46QgyPomfblHUrCdwyH";

  constructor(private http: HttpClient) { }

  searchFood(query: string): Observable <any> {
    return this.http.get(`${this.baseUrl}?api_key=${this.apiKey}&query=${query}`);
  }
}
