// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  cordova_identity_client: 'xxxx-xxx-xxx-xxx-xxx',
  cordova_identity_server: 'https://aac.platform.smartcommunitylab.it/aac',
  cordova_redirect_url: 'testappionicio://callback',
  cordova_scopes: 'openid profile email profile.basicprofile.me',
  cordova_end_session_redirect_url: 'testappionicio://endSession',

  implicit_identity_client: 'xxxx-xxx-xxx-xxx-xxx',
  implicit_identity_server: 'http://localhost:8080/aac',
  implicit_redirect_url: 'http://localhost:8100/implicit/authcallback',
  implicit_scopes: 'openid profile email',
  implicit_end_session_redirect_url: 'http://localhost:8100/implicit/endsession',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
