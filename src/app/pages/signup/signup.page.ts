import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MenuController, NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/Authentication/authentication.service";
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError = {
    error: false,
    name: "",
  };

  /*form = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    country: "ECUADOR",
    app_id: 1,
  }*/

  constructor(
    private route: Router,
    private navCtrl: NavController,
    public menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
  ) {

  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password_confirm: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30), this.equalto('password')])]),
      country: new FormControl('ECUADOR'),
      app_id: new FormControl(1),
    })
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      let isValid = control.root.value[field_name] == input;
      if (!isValid)
        return {'equalTo': {isValid}};
      else
        return null;
    };
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  signIn() {
    this.navCtrl.navigateRoot(['./signin']);
  }

  home() {
    this.navCtrl.navigateRoot(['./home']);
  }

  ngSubmit() {
    console.log('onRegister...');
  }

  onSubmit() {
    this.hasError.error = false
    this.hasError.name = ""
    console.log('onRegister:' + JSON.stringify(this.registrationForm.value));
    console.log(this.registrationForm.get('name').value);
    if (this.registrationForm.get('name').value.toString().trim().length < 3) {
      this.hasError.error = true
      this.hasError.name = "name"
    } else {
      if (this.registrationForm.get('email').value.toString().trim().length < 6) {
        this.hasError.error = true
        this.hasError.name = "email"
      } else {
        if (
          this.registrationForm.get('password').value.toString().trim().length > 0
          && this.registrationForm.get('password').value != this.registrationForm.get('password_confirm').value
        ) {
          this.hasError.error = true
          this.hasError.name = "password"
        } else {
          console.log('Las contraseñas SI son iguales');
          this.authService.registerUser(this.registrationForm)
            .then(res => {
              console.log(res);
              this.navCtrl.navigateForward("login", {});
            }, err => {
              console.log(err);
            })
        }
      }
    }
  }

  async presentToast(message?: string, duration?: number) {
    const toast = await this.toastCtrl.create({
      position: 'bottom',
      duration: duration || 3000,
      message: message || "Acción realizada"
    });
    await toast.present();
  }
}

class PasswordValidator {
  static areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    }
  }
}

