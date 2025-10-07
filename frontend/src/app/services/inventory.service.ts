import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:5000/api/inventory';

  constructor(private http: HttpClient) { }

  createItem(itemData: any): Observable<any> {
    return this.http.post(this.apiUrl, itemData);
  }

  getAllItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateItem(id: string, itemData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, itemData);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}