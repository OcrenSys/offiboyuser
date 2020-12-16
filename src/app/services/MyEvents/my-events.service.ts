import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyEventsService {

  private selectedLanguage = new Subject<string>();

  constructor() { }

  public getLanguageObservable(): Observable<string> {
    return this.selectedLanguage.asObservable();
  }

  public setLanguageData(data) {
    this.selectedLanguage.next(data);
  }
}
