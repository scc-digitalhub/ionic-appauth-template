import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';

import { IonicAuth, IonicAuthorizationRequestHandler, DefaultBrowser, AuthActionBuilder} from 'ionic-appauth';
import { CordovaRequestorService } from './cordova/cordova-requestor.service';
import { BrowserService } from './cordova/browser.service';
import { SecureStorageService } from './cordova/secure-storage.service';
import { StorageService } from './angular/storage.service';
import { RequestorService } from './angular/requestor.service';
import { IonicImplicitRequestHandler } from 'ionic-appauth/lib/implicit-request-handler';

import { TokenResponse } from '@openid/appauth';

import { environment } from '../../environments/environment';

/**
 * Authentication service. Should be called on app startup to subscribe to the app navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth  {

  constructor(
    requestor: RequestorService,
    cordovaRequestor: CordovaRequestorService,
    secureStorage: SecureStorageService,
    storage: StorageService,
    browser: BrowserService,
    private platform: Platform,
    private ngZone: NgZone,
  ) {
    super(
      (platform.is('cordova')) ? browser : undefined,
      (platform.is('cordova')) ? secureStorage : storage,
      (platform.is('cordova')) ? cordovaRequestor : requestor,
      undefined, undefined,
      (platform.is('cordova')) ? new IonicAuthorizationRequestHandler(browser, secureStorage)
                               : new IonicImplicitRequestHandler(new DefaultBrowser(), storage)
      // new IonicAuthorizationRequestHandler(new DefaultBrowser(), storage)
    );

    this.addConfig();
  }

  /**
   * Override to handle cordova callback
   */
  public async startUpAsync() {
    if (this.platform.is('cordova')) {
      (<any>window).handleOpenURL = (callbackUrl) => {
        this.ngZone.run(() => {
            this.handleCallback(callbackUrl);
        });
      };
    }

    super.startUpAsync();
  }

  /**
   * Extension to manage correctly the implicit token refresh: no token expected, so do logout and return null
   * @param token: token data to refresh
   */
  protected async requestNewToken(token: TokenResponse): Promise<TokenResponse | undefined>  {
    if (!!token.refreshToken) {
      await this.requestRefreshToken(token);
      return this.getTokenFromObserver();
    } else {
      await this.EndSessionCallBack();
      return undefined;
    }
  }


  /**
   * Extension to force cleanup even before end session confirmation. Optional, may be revised.
   */
  public async signOut() {
    await super.signOut();
    this.EndSessionCallBack();
    // this.storage.removeItem('token_response');
    // this.authSubject.next(AuthActionBuilder.SignOutSuccess());
  }

  private addConfig() {
    if (this.platform.is('cordova')) {
      this.authConfig = {
        identity_client: environment.cordova_identity_client,
        identity_server: environment.cordova_identity_server,
        redirect_url: environment.cordova_redirect_url,
        scopes: environment.cordova_scopes,
        usePkce: true,
        end_session_redirect_url: environment.cordova_end_session_redirect_url,
      };
    } else {
      this.authConfig = {
        identity_client: environment.implicit_identity_client,
        identity_server: environment.implicit_identity_server,
        redirect_url: environment.implicit_redirect_url,
        scopes: environment.implicit_scopes,
        usePkce: true,
        end_session_redirect_url: environment.implicit_end_session_redirect_url,
      };
    }
  }

  private handleCallback(callbackUrl: string): void {
    if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0) {
      this.AuthorizationCallBack(callbackUrl);
    }

    if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
      this.EndSessionCallBack();
    }
  }
}
