import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';
import { Injectable } from '@angular/core';

/**
 * Auto-injected Storage service for Cordova app.
 */
@Injectable({
  providedIn: 'root'
})
export class SecureStorageService extends CordovaSecureStorage {

}
