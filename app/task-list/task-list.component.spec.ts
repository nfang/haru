import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { Task } from '../shared/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import {
  TASK_SERVICE_TOKEN,
  InMemoryTaskProvider,
  IN_MEMORY_TASK_SERVICE_PROVIDERS
} from '../shared/services';
import {
  SortOrder,
  SortSpec,
  FilterSpec,
  QueryCommand
} from '../shared/utils/query-command';

class MockInMemoryTaskProvider {
  public tasks: Task[] = [
    new Task('Task 1', 'Note 1'),
    new Task('Task 2', 'Note 2'),
    new Task('Task 3', 'Note 3')
  ];
}

describe('TaskListComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    TaskListComponent,
    TestComponentBuilder,
    HTTP_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('should inject the component', inject([TaskListComponent],
    (component: TaskListComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(TaskListComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(TaskListComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  it('should show a list of incompleted tasks', inject([ TaskListComponent ], (component) => {
    let tasks = component.incompletedTasks;
    expect(tasks.length).toBe(3);
  }));

  it('should return a filtered list of tasks according to query', inject([ TaskListComponent ],
    (component) => {
      component.updateQuery({ value: new Task('Task 3') });
      let tasks = component.incompletedTasks;
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toEqual('Task 3');
  }));

  it('should return a ordered list of tasks according to order', inject([], () => {
    return builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        let beforeOrderTasks = component.incompletedTasks;

        expect(beforeOrderTasks[0].title).toEqual('Task 1');

        component.queryCommand = new QueryCommand();
        component.queryCommand.sortBy = new SortSpec(['isPrioritised', 'createAt'], [SortOrder.DESC, SortOrder.DESC]);
        taskService.add(new Task('Task 4', 'Note 4'));
        fixture.detectChanges();

        expect(component.incompletedTasks[0].title).toEqual('Task 4');
      });
  }));

  it('should group tasks into correct task list based on isCompleted field', inject([], () => {
    return builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        let incompletedTasks = component.incompletedTasks;
        incompletedTasks[0].isCompleted = true;
        fixture.detectChanges();

        expect(component.incompletedTasks.length).toBe(2);
        expect(component.completedTasks.length).toBe(1);
      });
  }));

  it('should show or hide button based on there is completed task or is not', inject([], () => {
    return builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            button = element.querySelector('.mui-btn');

        let incompletedTasks = component.incompletedTasks;
        fixture.detectChanges();
        expect(button).toBeUndefined;

        incompletedTasks[0].isCompleted = true;
        fixture.detectChanges();
        expect(component.completedTasks.length).toBe(1);
        button = element.querySelector('.mui-btn');
        expect(button).not.toBeUndefined;
      });
  }));

  it('should show correct button text based on showCompletedTasks field', inject([], () => {
    return builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement;

        let incompletedTasks = component.incompletedTasks;
        incompletedTasks[0].isCompleted = true;
        fixture.detectChanges();

        let button = element.querySelector('.mui-btn');
        expect(component.completedTasks.length).toBe(1);
        expect(component.showCompletedTasks).toBe(false);
        expect(button.innerText.toLowerCase().includes('show')).toBe(true);

        component.showCompletedTasks = true;
        fixture.detectChanges();
        expect(button.innerText.toLowerCase().includes('hide')).toBe(true);
      });
  }));
});

@Component({
  selector: 'test',
  template: `<task-list></task-list>`,
  directives: [TaskListComponent]
})
class TaskListComponentTestController { }
