import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { todomodel } from './todomodel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getTodoList(): Observable<todomodel[]> {
    return this.http.get<todomodel[]>(this.apiURL + '/ToDoModels')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getTodo(id): Observable<todomodel> {
    return this.http.get<todomodel>(this.apiURL + '/ToDoModels/' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  createTodo(mytodo): Observable<todomodel> {
    console.log('trying to save', JSON.stringify(mytodo));
    return this.http.post<todomodel>(this.apiURL + '/ToDoModels', JSON.stringify(mytodo), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  updateTodo(id, mytodo): Observable<todomodel> {
    console.log('trying to update',id, mytodo);
    return this.http.put<todomodel>(this.apiURL + '/ToDoModels/' + id, JSON.stringify(mytodo), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteTodo(id){
    return this.http.delete<todomodel>(this.apiURL + '/ToDoModels/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       errorMessage = error.error.message;
     } else {
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}
