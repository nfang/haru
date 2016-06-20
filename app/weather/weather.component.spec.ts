import {
  async,
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  BaseRequestOptions,
  ResponseOptions,
  Http,
  Response
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { WeatherComponent } from './weather.component';

describe('A WeatherComponent', () => {
  let backend, builder, connection, http;

  const YQL_API = 'http://query.yahooapis.com/v1/public/yql';

  beforeEachProviders(() => [
    BaseRequestOptions,
    MockBackend,
    {
      provide: Http,
      useFactory: (backend, options) => {
        return new Http(backend, options);
      },
      deps: [MockBackend, BaseRequestOptions]
    }
  ]);

  beforeEach(inject([TestComponentBuilder, MockBackend], (tcb, mockBackend) => {
    builder = tcb;
    backend = mockBackend;
  }));

  it('can be used as a directive', async(() => {
    builder.createAsync(WeatherComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.debugElement.query(By.directive(WeatherComponent));

        expect(component).toBeTruthy();
        expect(component.componentInstance).toBeTruthy();
      });
  }));

  it('gets current weather condition from Yahoo Weather API', (done) => {
    builder.createAsync(WeatherComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        backend.connections.subscribe(c => {
          expect(c.request.url.startsWith(YQL_API)).toBe(true);
          done();
        });
        component.getWeatherCondition({
          coords: { longitude: 1, latitude: 1 }
        });
      });
  });

});

@Component({
  selector: 'test',
  template: `<weather></weather>`,
  directives: [WeatherComponent]
})
class WeatherComponentTestController { }
