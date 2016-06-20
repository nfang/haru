import {
  async,
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { Task } from './shared/task.model';
import { AppComponent } from './app.component'
import {
  HistoryService,
  TASK_SERVICE_TOKEN,
  InMemoryTaskProvider,
  IN_MEMORY_TASK_SERVICE_PROVIDERS
} from './shared/services';

class MockInMemoryTaskProvider {
  public tasks: Task[] = [
    new Task('Task 1', 'Note 1'),
    new Task('Task 2', 'Note 2'),
    new Task('Task 3', 'Note 3')
  ];
}

describe('An AppComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    HistoryService
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('shows today\'s date and day', async(() => {
    builder.createAsync(AppComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          today = new Date();

        // expect(element.querySelector('md-card-title').textContent)
        //   .toBe(today.toLocaleString('en-US', { weekday: 'long' }));
        // expect(element.querySelector('md-card-subtitle').textContent)
        //   .toBe(today.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
      });
  }));

  it('shows task progress', async(() => {
    builder.createAsync(AppComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          tasks = taskService.list();
        expect(component.progress).toBe('0 / 3');

        tasks[0].isCompleted = true;
        expect(component.progress).toEqual('1 / 3');
      });
  }));

});
