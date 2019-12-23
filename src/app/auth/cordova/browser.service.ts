import { CordovaBrowser } from 'ionic-appauth/lib/cordova';
import { Injectable } from '@angular/core';

/**
 * Browser service for Cordova app. Requred by AuthService.
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserService extends CordovaBrowser {
}
