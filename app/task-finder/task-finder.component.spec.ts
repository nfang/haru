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

import { Task } from '../shared/task.model';
import { TaskFinderComponent, ValueChangeEvent } from './task-finder.component';
import {
  HistoryService,
  TASK_SERVICE_TOKEN,
  InMemoryTaskProvider,
  IN_MEMORY_TASK_SERVICE_PROVIDERS
} from '../shared/services';

class MockInMemoryTaskProvider {
  public tasks: Task[] = [
    new Task('Task 1', 'Note 1'),
    new Task('Task 2', 'Note 2'),
    new Task('Task 3', 'Note 3')
  ];
}

describe('A TaskFinderComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
    HistoryService,
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    HTTP_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('can be used as a directive', async(() => {
    builder.createAsync(TaskFinderComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.debugElement.query(By.directive(TaskFinderComponent));

        expect(component).toBeTruthy();
        expect(component.componentInstance).toBeTruthy();
      });
  }));

  it('notifies when input is changed', done => {
    builder.createAsync(TaskFinderComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement;
        const NEW_TASK = 'new task';
        component.onChange.subscribe((event: ValueChangeEvent) => {
          expect(event).toBeTruthy();
          expect(event.value instanceof Task).toBe(true);
          expect(event.value.title).toBe(NEW_TASK);
          done();
        });
        component.query.updateValue(NEW_TASK);
      })
      .catch(e => done.fail(e));
  });

  it('creates a new task', done => {
    builder.createAsync(TaskFinderComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement;
        const NEW_TASK = 'new task';
        component.query.updateValue(NEW_TASK);
        component.submit({ preventDefault: () => {} });

        let len = taskService.list().length;
        expect(len).toBe(4);
        expect(taskService.list()[len - 1].title).toBe(NEW_TASK);
        done();
      })
      .catch(e => done.fail(e));

  });
});

@Component({
  selector: 'test',
  template: `<task-finder></task-finder>`,
  directives: [TaskFinderComponent]
})
class TaskFinderComponentTestController { }
