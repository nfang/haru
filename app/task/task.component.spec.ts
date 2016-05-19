import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Task } from '../shared/task.model';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../shared/task.service';
import { TaskProvider } from '../shared/mock-tasks';

class MockTaskProvider {
  public tasks: Task[] = [
    new Task('Task1', 'Note1', new Date(2016, 5, 14)),
    new Task('Task2', 'Note2', new Date(2016, 5, 20))
  ]
}

describe('TaskComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
    provide(
      TaskProvider, { useClass: MockTaskProvider }
    ),
    TaskComponent,
    TaskService,
    TestComponentBuilder
  ]);

  beforeEach(inject([TestComponentBuilder, TaskService], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('should inject the component', inject([TaskComponent],
    (component: TaskComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(TaskComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(TaskComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  it('renders a task', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
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
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task: Task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('.isCompleted').checked).toBeFalsy();
        component.markCompleted();
        fixture.detectChanges();
        expect(task.isCompleted).toBeTruthy();
        done();
      })
      .catch(e => done.fail(e));;
  });

  it('can remove a task', done => {
    builder.createAsync(TaskComponent)
     .then((fixture: ComponentFixture<any>) => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[0];
       component.task = task;
       fixture.detectChanges();
       expect(component.task).not.toBeNull();
       component.removeTask();
       fixture.detectChanges();
       expect(taskService.list().length).toBe(1);
       done();
     })
     .catch(e => done.fail(e));;
  });

  it('can prioritise a task', done => {
    builder.createAsync(TaskComponent)
     .then((fixture: ComponentFixture<any>) => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[1];
       component.task = task;
       fixture.detectChanges();
       expect(element.querySelector('.isPrioritised').checked).toBeFalsy();
       component.markPrioritised();
       fixture.detectChanges();
       expect(task.isPrioritised).toBeTruthy();
       done();
     })
     .catch(e => done.fail(e));;
  });
});

@Component({
  selector: 'test',
  template: `<task></task>`,
  directives: [TaskComponent]
})
class TaskComponentTestController { }
