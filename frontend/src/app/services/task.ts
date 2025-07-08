import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'done';
  isDeleted: '0' | '1';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  create(data: { title: string; description: string }): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/${id}`);
  }

  getOne(id: string): Observable<Task> {
    return this.getAll().pipe(
      map(tasks => tasks.find(t => t.id === id)!)
    );
  }
}