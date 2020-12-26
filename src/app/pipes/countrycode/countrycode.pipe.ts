import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countrycode'
})
export class CountrycodePipe implements PipeTransform {

  data = [
    {
      code: "+505",
      country: "Nicaragua",
    },
    {
      code: "+593",
      country: "Ecuador",
    },

  ]

  // @ts-ignore
  result = this.data.reduce((acc, val) => {
    acc[val.country] = val;
    return acc
  }, {})

  transform(value: string, ...args: unknown[]): unknown {
    console.log(this.result);
    return value; // this.result[value]?.code || value;
  }

}
