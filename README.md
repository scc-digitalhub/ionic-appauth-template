# Ionic AppAuth Template project

The project represents a template for Ionic App with the support for OpenID Connect. The included services
allow for user authentication with the external OpenID provider, token retrieval and refresh, controlled
end session, etc.

The template is suitable both for native Cordova app (using PKCE flow) and for the browser apps (using implicit flow).

## 1. Requirements

The template relies on the following dependencies for the authentication flow:

- ``@openid/appauth`` for the App Auth flow implementation of OpenID Connect client
- ``ionic-appauth`` (version 0.3.8) for the Ionic adoption of that library

For the Cordova-based implementation, the project adopts:

- ``cordova-plugin-secure-storage`` for secure credentials storage
- ``cordova-plugin-customurlscheme`` for custom scheme to open app from the browser (needed for mobile app callback).
- ``cordova-plugin-safariviewcontroller`` for controlled and secure browser-based authentication with redirects.

## 2. Configuration

The project should be correctly configured to work with the OpenID Connect flow. Specifically, it is necessary to

- define the custom URL scheme for app redirects. For example, use the reversed package id od the app to guarantee unique value.
  The URL scheme should be correctly configured. See [Cordova custom URL scheme plugin](https://github.com/EddyVerbruggen/Custom-URL-scheme) for details.
- define the OpenID Connect parameters for Cordova and Browser Implicit flows. Specifically, the following environment variables should be defined (with prefix ``cordova_`` or ``implicit_`` correspondingly)
  - ``identity_client``: Client ID of the application.
  - ``identity_server``: The endpoint of the Open ID Connect server.
  - ``redirect_url``: URL to redirect the browser upon successfull authentication. Should match one of the values configured for the cleint app. Please note that for Cordova app the URL scheme  should match the one defined for the custom URL scheme of the app, e.g., ``com.example.myapp://callback``.
  - ``scopes``: the OAuth2.0 scopes to be requested for the app.
  - ``end_session_redirect_url``: the URL to which the app will be redirected upon successful signout operation. Should match one of the redirect URI values configured for the cleint app. Please note that for Cordova app the URL scheme  should match the one defined for the custom URL scheme of the app, e.g., ``com.example.myapp://endsession``.

## 3. Usage

The ``AuthService`` class from ``app/auth/auth.service.ts`` contains the necessary authentication/authorization functionality for the application.

### 3.1 App initialization

To initialize the authentication functionality, use the ``startUpAsync`` method. This method initializes the components and retrieves the stored token data. If the token is present, it notifies the value to the subscribed listeners.

```
this.platform.ready().then(() => {
    this.auth.startUpAsync();
    this.statusBar.styleDefault();
    this.splashScreen.hide();
});
```

### 3.2 Sign In

To perform user authentication, use the ``signIn`` method. The method initializes the OpenID Connect authorization flow opening a browser and redirecting back to the specified URLs. In case of implicit flow, the redirect is intercepted by the ``AuthCallbackPage`` from ``app/auth/implicit/auth-callback`` module. In case of Cordova app, the callback is managed by the service directly. As a result, the token is stored and successful / failed authentication status is notified to the subscribers.

```
  signIn() {
    this.auth.signIn();
  }
  
  ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignInSuccess) {
        this.navCtrl.navigateRoot('home');
      }
    });
  }
```

Sign in operation creates token information and stores it locally.
In case of native app, the refresh token will be stored as well to
allow creation of new tokens without requiring the user to sign in again.

### 3.3 Sign Out

To sign the user out, use the ``signOut`` method. It initializes
the logout operation opening a browser and redirecting back to the specified URLs. In case of implicit flow, the redirect is intercepted by the ``EndSessionPage`` from ``app/auth/implicit/end-session`` module.

```
  signOut() {
    this.auth.signOut();
  }
 
  ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('landing');
      }
    });
  }
```

### 3.4 Obtain User Info

A dedicated asynchronous ``getUserInfo`` method may be used to retrieve the user information. The method calls the user information 
endpoint using the stored access token. If the token is expired, the
refresh token operation will be engaged for the native app. In case of implicit flow, the user will be signed out locally.

```
  public async getUserInfo(): Promise<void> {
    try {
      this.userInfo = await this.auth.getUserInfo<IUserInfo>();
    } catch (e) {
      alert('Error calling userinfo: ' + e);
    }
  }
```

### 3.5 Calling Protected APIs

To call the protected endpoint, it is necessary to accompany the call with the access token as Authorization header. To retrieve the
token value, it is necessary to use the asynchronous ``getValidToken`` method of the  service. The method returns the stored token object containing access token string. If the token is expired, an attempt to refresh it will be automatically performed.

```

  public async getSomeData(): Promise<void> {
    try {
      const token = await this.auth.getValidToken();
      const data = await this.http.get(
        'http://protected.com/some/data',
        {headers: {Authorization: `Bearer ${token.accessToken}`}})
      .toPromise();
    } catch (e) {
      alert('Error calling some data: ' + e);
    }
  }
  ```

