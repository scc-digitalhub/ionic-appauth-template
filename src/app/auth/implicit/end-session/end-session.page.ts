import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';

/**
 * Page to handle end session callback for browser-based version.
 * Should be customized by the app to handle app-specific redirects.
 */
@Component({
  template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.authService.EndSessionCallBack();
    this.navCtrl.navigateRoot('landing');
  }

}
