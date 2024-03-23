import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  public loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      username: username,
      password: password
    };
    console.log('url, body' , url , body)
    return lastValueFrom(this.http.post(url, body));
  }

  async createTodo() {
    const url = environment.baseUrl + "/todos/";
    const body = {
      "title": "Sport machen", // Eingabefelder müssen vorhanden sein!
      "author":"Sportler", // Eingabefelder müssen vorhanden sein!
      "checked":false // Eingabefelder müssen vorhanden sein!
    };
    console.log(body,url)
    return lastValueFrom(this.http.post(url, body));
  }

  async updateTodo() {
    const url = environment.baseUrl + "/todos/";
    const body = {
      "title": "Sport machen", // Eingabefelder müssen vorhanden sein!
      "author":"Sportler", // Eingabefelder müssen vorhanden sein!
      "checked":false // Eingabefelder müssen vorhanden sein!
    };
    console.log(body,url)
    return lastValueFrom(this.http.put(url, body));
  }

  async deleteTodo() {
    const url = environment.baseUrl + "/todos/";
    const body = {
      "title": "Sport machen", // Eingabefelder müssen vorhanden sein!
      "author":"Sportler", // Eingabefelder müssen vorhanden sein!
      "checked":false // Eingabefelder müssen vorhanden sein!
    };
    console.log(body,url)
    return lastValueFrom(this.http.delete(url));
  }

}


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.router.navigateByUrl('/login');
        }
        return throwError(() => err);
      })
    );
  }
}