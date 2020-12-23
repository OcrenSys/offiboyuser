import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonSearchbar, ModalController, NavController, Platform} from "@ionic/angular";
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {Places} from "../../utils/Enums/Places";

declare var google;

// import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
// import AutocompletePrediction = google.maps.places.AutocompletePrediction;
// import AutocompletionRequest = google.maps.places.AutocompletionRequest;


@Component({
  selector: 'app-ion-search',
  templateUrl: './ion-search.component.html',
  styleUrls: ['./ion-search.component.scss'],
})
export class IonSearchComponent implements OnInit {
  @ViewChild('searchbar', {static: true}) searchbar: IonSearchbar;

  @Input() autocompleteService: any;
  @Input() placesService: any;
  @Input() input: any;

  places: Array<any> = [];
  PLACES = Places;

  tab: string = "drivers";


  constructor(
    private platform: Platform,
    public googleMapsService: GoogleMapsService,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
  }

  searchPlace() {
    if (this.googleMapsService.google_address != '') {
      let autocompleteRequest: any = {
        types: ['geocode', 'establishment'],
        input: this.googleMapsService.google_address,
        componentRestrictions: {
          country: 'NI',
        }
      };

      this.autocompleteService.getPlacePredictions(autocompleteRequest, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.places = [];
          predictions.map((prediction) => {
            this.places.push(prediction);
          });

          console.log('\n\nplaces predicted...\n', this.places);
        }
      });
    } else {
      this.places = [];
    }
  }

  selectPlace(type, place?) {
    let data = {};
    switch (type) {
      case  this.PLACES.CURRENT_LOCATION:
        data = {
          type: this.PLACES.CURRENT_LOCATION,
          data: null
        };
        this.modalCtrl.dismiss(data);
        break;
      case this.PLACES.SELECTED_LOCATION:
        this.googleMapsService.google_address = place.description;
        data = {
          type: this.PLACES.SELECTED_LOCATION,
          data: place
        };
        this.modalCtrl.dismiss(data);
        break;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
