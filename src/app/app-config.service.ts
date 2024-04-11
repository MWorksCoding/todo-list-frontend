import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor() { }
  
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();
  toggleDarkTheme(isDark: boolean) {
    this.isDarkSubject.next(isDark);
  }
}
