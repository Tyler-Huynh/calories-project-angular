import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class USDAApiService {

  private baseUrl = "https://api.nal.usda.gov/fdc/v1/foods/search"; //the basURL for the api itself
  private apiKey = "f5TEEKlC3bvcTgjyEUJde46QgyPomfblHUrCdwyH"; //my api key

  constructor(private http: HttpClient) { }

  searchFood(query: string): Observable <any> {
    return this.http.get(`${this.baseUrl}?api_key=${this.apiKey}&query=${query}`); //procking the api for the info we want
  }
}
