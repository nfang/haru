import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { Task } from './shared/task.model';
import { AppComponent } from './app.component'
import {
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

describe('AppComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    AppComponent,
    TestComponentBuilder
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('should initialize', inject([AppComponent], (component) => {
    spyOn(console,'log');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalled();
    expect(component.today).not.toBeNull();
  }));

  it('should return task progress', inject([AppComponent], (component) => {
    expect(component.progress).toEqual('0 / 3');

    let tasks = taskService.list();
    tasks[0].isCompleted = !tasks[0].isCompleted;
    expect(component.progress).toEqual('1 / 3');
  }));

});
