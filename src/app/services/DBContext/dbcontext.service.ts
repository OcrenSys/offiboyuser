import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class DBContextService {

  constructor(private storage: Storage) {
  }

  setData(key: string, data: any) {
    return this.storage.set(key, data);
  }

  getData(key: string) {
    const data = this.storage.get(key);
    if(data)
      return data;
    return null;
  }
}
