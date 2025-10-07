import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldLogService {
  private apiUrl = 'http://localhost:5000/api/fieldlogs';

  constructor(private http: HttpClient) { }

  // Create a new field log
  createFieldLog(logData: any): Observable<any> {
    return this.http.post(this.apiUrl, logData);
  }

  // Get all field logs (for Manager)
  getAllFieldLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}