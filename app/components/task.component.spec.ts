import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
import { provide } from 'angular2/core';

import { Task } from '../models/task';
import { TaskComponent } from './task.component';
import { TaskService } from '../services/task.service';
import { TaskProvider } from '../services/mock-tasks';

class MockTaskProvider {
  public tasks: Task[] = [
    new Task('Task', 'Note', new Date())
  ]
}

describe('TaskComponent', () => {
  let tcb, taskService;

  beforeEachProviders(() => [
    provide(
      TaskProvider, { useClass: MockTaskProvider }
    ),
    TaskComponent,
    TaskService,
    TestComponentBuilder
  ]);

  beforeEach(inject([TestComponentBuilder, TaskService], (builder, service) => {
    tcb = builder;
    taskService = service;
  }));

  it('renders a task', done => {
    tcb.createAsync(TaskComponent)
      .then(fixture => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('p').innerText).toBe(task.title);
        expect(element.querySelector('span').innerText).toBe(task.dueDate.toString());
        done();
      })
      .catch(e => done.fail(e));
  })

  it('can mark a task complete', done => {
    tcb.createAsync(TaskComponent)
      .then(fixture => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task: Task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('input[type=checkbox]').checked).toBeFalsy();
        component.markComplete();
        fixture.detectChanges();
        expect(task.isCompleted).toBeTruthy();
        done();
      })
      .catch(e => done.fail(e));;
  });

  it('can remove a task', done => {
    tcb.createAsync(TaskComponent)
     .then(fixture => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[0];
       component.task = task;
       fixture.detectChanges();
       expect(component.task).not.toBeNull();
       component.removeTask();
       fixture.detectChanges();
       expect(taskService.list().length).toBe(0);
       done();
     })
     .catch(e => done.fail(e));;
  });
});
