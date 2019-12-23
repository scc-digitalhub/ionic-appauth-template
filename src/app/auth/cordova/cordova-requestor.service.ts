import { CordovaRequestor } from 'ionic-appauth/lib/cordova';
import { Injectable } from '@angular/core';

/**
 * Required by the Auth Service to perform HTTP request. Uses Cordova-based implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class CordovaRequestorService extends CordovaRequestor {
}
