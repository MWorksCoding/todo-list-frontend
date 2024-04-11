import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppConfigService } from '../app-config.service';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  isDarkTheme: boolean = false;
  @HostBinding('class')
  get themeMode() {
    return this.isDarkTheme ? 'theme-dark' : 'theme-light';
  }

  error: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private configs: AppConfigService,
    private http: HttpClient,
  ) {}


  /**
   * Initialization / activate dark mode
   */
  ngOnInit(): void {
    this.configs.isDark$.subscribe((isDark: any) => {
      this.isDarkTheme = isDark;
    });
    this.logout()
  }


  /**
   * Logout and delete users token
   */
  async logout() {
    try {
      const url = environment.baseUrl + '/logout/';
      let headers = new HttpHeaders();
      headers = headers.set(
        'Authorization',
        'Token' + localStorage.getItem('token')
      ); 
      await lastValueFrom(this.http.post(url, {}, { headers }));
      localStorage.removeItem('token');
      this.router.navigateByUrl('/logout');
    } catch (e) {
      this.error = 'Error while logging out';
    }
  }


  /**
   * toggeling to dark mode
   */

  toggleTheme(isDark: boolean) {
    this.configs.toggleDarkTheme(isDark);
  }
}
