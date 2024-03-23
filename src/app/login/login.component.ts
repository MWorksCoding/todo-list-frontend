import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(
    private router: Router,
     private auth : AuthService) {}

  ngOnInit(): void {}

  /**
   * Communication to backend
   */
  async login() {
    try {
      let resp:any  = await this.auth.loginWithUsernameAndPassword(this.username, this.password);
      localStorage.setItem('token', resp['token']); // save token to local storage
      this.router.navigateByUrl('/todos'); //  Redirection
    } catch (e) {
      alert('Login failed')
      console.error(e);
    }
  }
}
