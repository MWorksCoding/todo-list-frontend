import { Component, HostBinding } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-list-frontend';
  isDarkTheme: boolean = false;
  @HostBinding('class')
  get themeMode() {
    return this.isDarkTheme ? 'theme-dark' : 'theme-light';
  }

  constructor(
    private configs: AppConfigService
  ) {}

  ngOnInit(): void {
    this.configs.isDark$.subscribe((isDark: any) => {
      this.isDarkTheme = isDark;
    });
  }
}
