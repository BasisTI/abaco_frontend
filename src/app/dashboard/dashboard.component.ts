import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from '@nuvem/angular-base';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { User } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string;
  password: string;

  authenticated = false;

  private routeSub: Subscription;

  constructor(
    private authService: AuthenticationService<User>,
    private http: HttpClient,
    private pageNotificationService: PageNotificationService,
  ) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
  }

  login() {

    if (!this.username || !this.password) {
      this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher os campos Obrigatórios!'));
      return;
    }
    if (this.password.length < 4) {
      this.pageNotificationService.addErrorMessage(this.getLabel('A senha precisa ter no mínimo 4 caracteres!'));
      return;
    }
  }
  protected getUserDetails(): Observable<any> {
    return this.http.get<any>(`${environment.auth.detailsUrl}`);
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    if (!storageUser) {
      return;
    }
    return storageUser.firstName + ' ' + storageUser.lastName;
  }

}