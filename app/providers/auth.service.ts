import {Storage, LocalStorage} from 'ionic-angular';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({clientID: 'p0YHk3HYjJP7HjleA1zwvNS9xCb5WfIw', domain: 'zhl146.auth0.com'});
  local: Storage = new Storage(LocalStorage);

  refreshSubscription: any;
  lockStatus = new Subject();

  lockOptions = {
    theme: {
      primaryColor: '#413751',
      logo: 'build/images/logo.png'
    },
    container: 'lock-container',
    languageDictionary: {
      title: 'Please sign in'
    },
    auth: {
      redirect: false,
      params: {
        prompt: 'select_account',
        scope: 'openid offline_access',
      }
    }
  };

  lock = new Auth0Lock('p0YHk3HYjJP7HjleA1zwvNS9xCb5WfIw', 'zhl146.auth0.com', this.lockOptions);

  constructor(private authHttp: AuthHttp) {
    console.log('auth service constructor has been run');

    this.lock.on('authenticated',
        (authResult) => {
            this.lockStatus.next(authResult);
        });
  }

  showLock() {
    this.lock.show();
  }

  hideLock() {
    this.lock.hide();
  }

  getLockStatus() {
    return this.lockStatus.asObservable();
  }

  setToken(authResult) {
    this.local.set('id_token', authResult.idToken);
    this.local.set('refresh_token', authResult.refreshToken);
    // console.log('id token set');
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    // Unschedule the token refresh
    this.unscheduleRefresh();
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    let source = this.authHttp.tokenStream.flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = this.authHttp.tokenStream.flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });

      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      source.subscribe(() => {
        this.getNewJwt();
        this.scheduleRefresh();
      });
    }
  }

  public unscheduleRefresh() {
    // Unsubscribe from the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.local.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.local.set('id_token', delegationRequest.id_token);
      });
    }).catch(error => {
      // console.log(error);
    });
  }


}
