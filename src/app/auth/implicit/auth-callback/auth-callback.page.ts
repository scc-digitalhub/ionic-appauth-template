import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AuthActions } from 'ionic-appauth';
import { skipWhile, take } from 'rxjs/operators';

/**
 * Page to handle Authorization callback for implicit flow in browser-based version.
 * Should be customized by the app to handle app-specific redirects.
 */
@Component({
  template: '<p>Signing in...</p>'
})
export class AuthCallbackPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.AuthorizationCallBack(this.router.url);
    this.authService.authObservable.pipe(
      skipWhile(action => action.action !== AuthActions.SignInSuccess && action.action !== AuthActions.SignInFailed),
      take(1))
    .subscribe((action) => {
      if (action.action === AuthActions.SignInSuccess) {
        this.navCtrl.navigateRoot('home');
      } else {
        this.navCtrl.navigateRoot('landing');
      }
    });
  }

}
