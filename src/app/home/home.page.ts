import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../models/user-info.model';
import { AuthActions } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userInfo: IUserInfo;
  data: any;

  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('landing');
      }
    });
  }

  signOut() {
    this.auth.signOut();
  }

  public async getUserInfo(): Promise<void> {
    try {
      this.userInfo = await this.auth.getUserInfo<IUserInfo>();
    } catch (e) {
      alert('Error calling userinfo: ' + e);
    }
  }

  public async getSomeData(): Promise<void> {
    try {
      const token = await this.auth.getValidToken();
      this.data = await this.http.get(
        'https://protected.com/some/data',
        {headers: {Authorization: `Bearer ${token.accessToken}`}})
      .toPromise();
    } catch (e) {
      alert('Error calling some data: ' + e);
    }
  }

}
