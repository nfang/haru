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
    new Task('Task1', 'Note1', new Date(2016, 5, 14)),
    new Task('Task2', 'Note2', new Date(2016, 5, 20))
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
        expect(element.querySelector('.task-title').innerText).toBe(task.title);
        expect(element.querySelector('time').innerText).toBe(task.dueDate.toString());
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
        expect(element.querySelector('.completed').checked).toBeFalsy();
        component.markCompleted();
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
           task = taskService.list()[0],
           len = taskService.list().length;
       component.task = task;
       fixture.detectChanges();
       expect(component.task).not.toBeNull();
       component.removeTask();
       fixture.detectChanges();
       expect(taskService.list().length).toBe(len - 1);
       done();
     })
     .catch(e => done.fail(e));;
  });

  it('can prioritise a task', done => {
    tcb.createAsync(TaskComponent)
     .then(fixture => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[1];
       component.task = task;
       fixture.detectChanges();
       expect(element.querySelector('.prioritised').checked).toBeFalsy();
       component.markPrioritised();
       fixture.detectChanges();
       expect(task.isPrioritised).toBeTruthy();
       done();
     })
     .catch(e => done.fail(e));;
  });
});
