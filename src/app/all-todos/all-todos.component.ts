import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrls: ['./all-todos.component.scss']
})
export class AllTodosComponent {
  displayedColumns: string[] = ['id', 'title', 'created_at', 'checked'];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  tableDataSource: any;
  todos: any = [];
  error: string = '';
  title: string = '';
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log('todos are:' , this.todos)
      this.tableDataSource = new MatTableDataSource(this.todos)
    } catch (e) {
      this.error = 'Error while loading';
    }
  }

  ngAfterViewInit() {
    if (this.tableDataSource && this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
    if (this.tableDataSource && this.sort) {
      this.tableDataSource.sort = this.sort;
    }
  }

  loadTodos() {
    const url = environment.baseUrl + '/todos/';
    let headers =new HttpHeaders();
    headers = headers.set('Authorization' , 'Token' + localStorage.getItem('token')); // get token from local storage
    return lastValueFrom(this.http.get(url));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  sendTodo() {
    console.log('todo is sended')
  }
}
