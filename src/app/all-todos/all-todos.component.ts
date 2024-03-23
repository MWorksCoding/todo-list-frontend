import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrls: ['./all-todos.component.scss']
})
export class AllTodosComponent {
  todos: any = [];
  error: string = '';
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log('todos are:' , this.todos)
    } catch (e) {
      this.error = 'Error while loading';
    }
  }

  loadTodos() {
    const url = environment.baseUrl + '/todos/';
    let headers =new HttpHeaders();
    headers = headers.set('Authorization' , 'Token' + localStorage.getItem('token')); // get token from local storage
    return lastValueFrom(this.http.get(url));
  }
}
