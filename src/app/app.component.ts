import {Component, Inject, OnInit} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {APP_CONFIG, AppConfig} from "./app.config";
import {TranslateService} from "@ngx-translate/core";
import {Constants} from "./utils/Constants";
import {MyEventsService} from "./services/MyEvents/my-events.service";
import {AuthenticationService} from "./services/Authentication/authentication.service";

import * as firebase from 'firebase';
import 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'heart'
    },
    {
      title: 'Login',
      url: '/signin',
      icon: 'mail'
    },
    {
      title: 'Register',
      url: '/signup',
      icon: 'paper-plane'
    },
    {
      title: 'Salir',
      url: 'logout',
      icon: 'paper-plane'
    },

  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  rtlSide = "left";

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private myEvent: MyEventsService
  ) {
    this.initializeApp();
    this.myEvent.getLanguageObservable().subscribe(value => {
      this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });

    console.log('\n\nfirebase.app().name', firebase.app().name, '\n\n');  // "[DEFAULT]"

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);
    });
  }

  globalize(languagePriority) {
    this.translate.setDefaultLang("es");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.rtlSide = "rtl";
        break;
      }
      default: {
        this.rtlSide = "ltr";
        break;
      }
    }
  }

  ngOnInit() {
    const path = window.location.pathname.split('pages/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  openPage(page) {
    if (page.url === "logout")
      this.logout();
    else
      this.navCtrl.navigateRoot([page.url], {});
  }

  logout() {
    this.authService.logoutUser()
      .then(() => {
        this.navCtrl.navigateRoot("", {})
          .then(() => {
            // this.isAthenticated = false;
          });
      });
  }
}
