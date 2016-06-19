import {
  Component,
  OnInit
} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'weathericons/css/weather-icons.css';

const YQL_API = 'http://query.yahooapis.com/v1/public/yql';

class WeatherCondition {
  code: string;
  temp: number;

  constructor(condition: {code: string, temp: string}) {
    this.code = condition.code;
    this.temp = +condition.temp;
  }

  get iconClass(): string {
    if (this.code.length) {
      return `wi wi-yahoo-${this.code}`;
    }
    return '';
  }
}

@Component({
  selector: 'weather',
  template: require('./weather.component.html'),
  styles: [
    require('./weather.component.scss')
  ],
  host: {
    '[class.reveal]': '!isLoading'
  }
})
export class WeatherComponent implements OnInit {

  private _weatherCondition: WeatherCondition;

  private _getCurrentPositionObservable;

  public isLoading: boolean;

  constructor(private _http: Http) {
    this.isLoading = true;
  }

  ngOnInit() {
    if ('geolocation' in window.navigator) {
      this._getCurrentPositionObservable =
        Observable.bindCallback(window.navigator.geolocation.getCurrentPosition
          .bind(window.navigator.geolocation));

      this._getCurrentPositionObservable()
        .subscribe(this.getWeatherCondition.bind(this));
    } else {
      console.warn('geolocation is not supported');
    }
  }

  private getWeatherCondition(pos: Position) {
    let yql = `select item.condition from weather.forecast
      where woeid in (
        select woeid from geo.places
        where text="(${pos.coords.latitude}, ${pos.coords.longitude})"
      ) and u="c"`;

    let params = new URLSearchParams();
    params.append('q', yql);
    params.append('format', 'json');

    let query = `${YQL_API}?${params.toString()}`;
    this._http.get(query).subscribe((rawData) => {
      let data = rawData.json();
      this._weatherCondition = new WeatherCondition(
        data.query.results.channel.item.condition);
      this.isLoading = false;
    });
  }

  get condition(): WeatherCondition {
    return this._weatherCondition || new WeatherCondition({
      code: '', temp: ''
    });
  }
}
