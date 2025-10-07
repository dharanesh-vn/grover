import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private apiUrl = 'http://localhost:5000/api/crops';

  constructor(private http: HttpClient) { }

  // Create a new crop
  createCrop(cropData: any): Observable<any> {
    return this.http.post(this.apiUrl, cropData);
  }

  // Get all crops
  getAllCrops(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a single crop by its ID
  getCropById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update an existing crop
  updateCrop(id: string, cropData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cropData);
  }

  // Delete a crop
  deleteCrop(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}