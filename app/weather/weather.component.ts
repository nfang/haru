import {
  Component,
  OnInit
} from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'weathericons/css/weather-icons.css';

const YQL_API = 'http://query.yahooapis.com/v1/public/yql';
const QUERY_INTERVAL = 15 * 60000;

class WeatherCondition {
  code: string = '';
  temp: number;
  text: string = '';

  constructor(condition) {
    if (condition) {
      this.code = condition.code;
      this.temp = +condition.temp;
      this.text = condition.text;
    }
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
  
  public isLoading: boolean;

  constructor(private _http: Http) {
    this.isLoading = true;
  }

  ngOnInit() {
    if ('geolocation' in window.navigator) {
      let getCurrentPosition = Observable.bindCallback(
        window.navigator.geolocation.getCurrentPosition.bind(window.navigator.geolocation)
      );

      Observable.timer(0, QUERY_INTERVAL)
        .switchMap(x => getCurrentPosition())
        .switchMap(this.getWeatherCondition.bind(this))
        .subscribe((data) => {
          this._weatherCondition = new WeatherCondition(data);
          this.isLoading = false;
        });
    } else {
      console.warn('geolocation is not supported');
    }
  }

  public getWeatherCondition(pos: Position) {
    let yql = `select item.condition from weather.forecast
      where woeid in (
        select woeid from geo.places
        where text="(${pos.coords.latitude}, ${pos.coords.longitude})"
      ) and u="c"`;

    let params = new URLSearchParams();
    params.append('q', yql);
    params.append('format', 'json');

    let query = `${YQL_API}?${params.toString()}`;
    return this._http.get(query)
      .map(this.mapResponse)
      .catch(this.handleError);
  }

  private mapResponse(res: Response) {
    let data = res.json();
    return data.query.count ? data.query.results.channel.item.condition : null;
  }

  private handleError(error) {
    let errMsg = error.message ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Observable.throw(error);
  }

  get weatherCondition(): WeatherCondition {
    return this._weatherCondition || new WeatherCondition(null);
  }
}
