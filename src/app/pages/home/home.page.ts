import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  home_tab: string = "list_view";
  faqExpand1: boolean;
  faqExpand2: boolean;
  faqExpand3: boolean;
  faqExpand4: boolean;
  faqExpand5: boolean;
  faqExpand6: boolean;
  faqExpand7: boolean;
  faqExpand8: boolean;
  fabAction = false;
  constructor(private route: Router) { }

  ngOnInit() {
  }
  reset(){
    this.faqExpand1=false;
    this.faqExpand2=false;
    this.faqExpand3=false;
    this.faqExpand4=false;
    this.faqExpand5=false;
    this.faqExpand6=false;
    this.faqExpand7=false;
    this.faqExpand8=false;
  }

  faqExpandToggle1() {
    this.reset();
    this.faqExpand1 = !this.faqExpand1;
  }

  faqExpandToggle2() {
    this.reset();
    this.faqExpand2 = !this.faqExpand2;
  }

  faqExpandToggle3() {
    this.reset();
    this.faqExpand3 = !this.faqExpand3;
  }

  faqExpandToggle4() {
    this.reset();
    this.faqExpand4 = !this.faqExpand4;
  }

  faqExpandToggle5() {
    this.reset();
    this.faqExpand5 = !this.faqExpand5;
  }

  faqExpandToggle6() {
    this.reset();
    this.faqExpand6 = !this.faqExpand6;
  }

  faqExpandToggle7() {
    this.reset();
    this.faqExpand7 = !this.faqExpand7;
  }
  faqExpandToggle8() {
    this.reset();
    this.faqExpand8 = !this.faqExpand8;
  }
  toggleFab(){
    this.fabAction = !this.fabAction;
  }

  trip_info() {
    this.route.navigate(['./trip-info']);
  }
  create_trip() {
    this.route.navigate(['./create-trip']);
  }
}

