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

  beforeEach(inject([TestComponentBuilder, MockBackend, Http], (tcb, mockBackend, httpService) => {
    builder = tcb;
    backend = mockBackend;
    http = httpService;
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
    // TODO
    done();
  });

});

@Component({
  selector: 'test',
  template: `<weather></weather>`,
  directives: [WeatherComponent]
})
class WeatherComponentTestController { }
