import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../user';

interface UserRoleResponse {
  role?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements AfterViewInit{


  @ViewChild('loginForm') loginForm!: NgForm;
  showErrorMessage = false;
  errorMessage = '';
  user: User =  new User();

  constructor(private loginservice: LoginService, private router: Router) {}

  ngAfterViewInit() {
    // Form initialization logic can be placed here
    this.clearFormFields();
  }

  login() {
    console.log(this.user);
    this.loginservice.loginUser(this.user).subscribe(
      (data: UserRoleResponse) => {
        console.log(data);
        if (data.role === 'A') {
          this.router.navigateByUrl('admin');
        } else if (data.role === 'D') {
          this.router.navigateByUrl('doctor');
        } else {
          this.showErrorMessage = true;
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 5000);  
        }
        this.clearFormFields();
      },
      error => {
        if (error.status === 401) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Error occurred while logging in';
        }
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 4000); 
        this.clearFormFields();
      }
    );
  }

  clearFormFields() {
    if (this.loginForm) {
      this.user.username = '';
      this.user.password = ''; 
      this.loginForm.resetForm();
    }
  }

}
