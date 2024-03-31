import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

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
  tableDataSource: any;
  todos: any = [];
  error: string = '';
  title: string = '';
  newTodo: string = '';
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.updateTable();
  }

  /**
   * updating material design tabledata with loaded data, activate paginatior and sort function
   */
  async updateTable() {
    try {
      this.todos = await this.loadTodos();
      console.log('todos are:', this.todos);
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
    console.log('todo is sended');
    try {
      const url = environment.baseUrl + '/todos/';
      const body = {
        title: this.newTodo,
        checked: false,
      };
      const response = await lastValueFrom(this.http.post(url, body));
      console.log('New todo:', response);
      this.updateTable();
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
    console.log('title::', title);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        id: id,
        checked: checked,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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
    console.log('updatedInfo', updatedInfo);
    this.updateTodo(updatedInfo);
  }

  /**
   * Sending a put request to update the data
   * @param updatedInfo title, id and checked status
   */
  async updateTodo(updatedInfo: any) {
    console.log(updatedInfo);
    console.log('todo is updated');
    try {
      const url = environment.baseUrl + '/todos/' + updatedInfo.id + '/';
      const body = {
        title: updatedInfo.title,
        checked: updatedInfo.checked,
      };
      console.log('body checked', body);
      const response = await lastValueFrom(this.http.put(url, body));
      console.log('Updated todo:', response);
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
      console.log('Deleted todo:', response);
      await this.updateTable();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
}
