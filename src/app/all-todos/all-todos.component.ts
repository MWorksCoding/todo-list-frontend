import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AppConfigService } from '../app-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrls: ['./all-todos.component.scss'],
})
export class AllTodosComponent {
  displayedColumns: string[] = [
    'id',
    'title',
    'created_at',
    'checked',
    'delete',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  isDarkTheme: boolean = false;
  @HostBinding('class')
  get themeMode() {
    return this.isDarkTheme ? 'theme-dark' : 'theme-light';
  }
  tableDataSource: any;
  todos: any = [];
  error: string = '';
  title: string = '';
  newTodo: string = '';
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private configs: AppConfigService,
    private router: Router
  ) {}

  /**
   * Initialization / activate dark mode
   */
  ngOnInit() {
    this.configs.isDark$.subscribe((isDark: any) => {
      this.isDarkTheme = isDark;
    });
    this.updateTable();
  }

  /**
   * updating material design tabledata with loaded data, activate paginatior and sort function
   */
  async updateTable() {
    try {
      this.todos = await this.loadTodos();
      this.tableDataSource = new MatTableDataSource(this.todos);
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    } catch (e) {
      this.error = 'Error while loading';
    }
  }

  /**
   * load data with an get request, sending a token coming from the local storage
   */
  loadTodos() {
    const url = environment.baseUrl + '/todos/';
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization',
      'Token' + localStorage.getItem('token')
    ); // get token from local storage
    return lastValueFrom(this.http.get(url));
  }

  /**
   * Apply Filter when typing in the input field
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  /**
   * add a new todo
   */
  async postTodo(): Promise<void> {
    try {
      const url = environment.baseUrl + '/todos/';
      const body = {
        title: this.newTodo,
        checked: false,
      };
      const response = await lastValueFrom(this.http.post(url, body));
      this.updateTable();
      this.newTodo = '';
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  /**
   * open dialog window for editing the todo text
   * sending the result to update the todo
   * @param title todo title
   * @param id todo id
   * @param checked boolean
   */
  openDialog(title: string, id: number, checked: boolean) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        id: id,
        checked: checked,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTodo(result);
      }
    });
  }

  /**
   * check or uncheck the todo
   * sending the result of the changing to update the todo
   * @param title todo title
   * @param id todo id
   * @param checked boolean status
   */
  checkTodo(title: string, id: number, checked: boolean) {
    let updatedInfo = {
      title: title,
      id: id,
      checked: checked,
    };
    this.updateTodo(updatedInfo);
  }

  /**
   * Sending a put request to update the data
   * @param updatedInfo title, id and checked status
   */
  async updateTodo(updatedInfo: any) {
    try {
      const url = environment.baseUrl + '/todos/' + updatedInfo.id + '/';
      const body = {
        title: updatedInfo.title,
        checked: updatedInfo.checked,
      };
      const response = await lastValueFrom(this.http.put(url, body));
      await this.updateTable();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  /**
   * deleting a todo by sending a delete request with the id
   */
  async deleteTodo(id: number) {
    try {
      const url = environment.baseUrl + '/todos/' + id + '/';
      const response = await lastValueFrom(this.http.delete(url));
      await this.updateTable();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  /**
   * toggeling to dark mode
   */

  toggleTheme(isDark: boolean) {
    this.configs.toggleDarkTheme(isDark);
  }
}
