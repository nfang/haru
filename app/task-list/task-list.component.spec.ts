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
import { TaskListComponent } from './task-list.component';
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

describe('A TaskListComponent', () => {
  let builder, taskService;

  beforeEachProviders(() => [
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
    builder.createAsync(TaskListComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.debugElement.query(By.directive(TaskListComponent));

        expect(component).toBeTruthy();
        expect(component.componentInstance).toBeTruthy();
      });
  }));

  it('shows a list of incompleted tasks', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;

        expect(component.incompletedTasks.length).toBe(3);
      });
  }));

  it('shows a list of completed tasks', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        component.incompletedTasks[0].isCompleted = true;

        expect(component.completedTasks.length).toBe(1);
      });
  }));

  it('filters tasks according to a specific query', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        component.updateQuery({ value: new Task('Task 3') });

        expect(component.incompletedTasks.length).toBe(1);
        expect(component.incompletedTasks[0].title).toBe('Task 3');
      });
  }));

  it('arranges tasks according to the specified order', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance;
        expect(component.incompletedTasks[0].title).toBe('Task 1');

        component.queryCommand = new QueryCommand();
        component.queryCommand.sortBy = new SortSpec(['isPrioritised', 'createAt'], [SortOrder.DESC]);
        taskService.add(new Task('Task 4', 'Note 4'));
        fixture.detectChanges();

        expect(component.incompletedTasks[0].title).toBe('Task 4');
      });
  }));

  it('hides "SHOW COMPLETED TASKS" button when there is no completed task', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            button = fixture.debugElement.query(By.css('.btn-container'));

        expect(button.nativeElement.classList).not.toContain('reveal');
      });
  }));

  it('shows "SHOW COMPLETED TASKS" button when there are completed tasks', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            button = fixture.debugElement.query(By.css('.btn-container'));
        component.incompletedTasks[0].isCompleted = true;
        fixture.detectChanges();

        expect(button.nativeElement.classList).toContain('reveal');
      });
  }));

  it('changes button text according to whether completed tasks are displayed', async(() => {
    builder.createAsync(TaskListComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            button = fixture.debugElement.query(By.css('.mui-btn')),
            nativeButton = button.nativeElement;
        component.incompletedTasks[0].isCompleted = true;
        fixture.detectChanges();

        expect(component.showCompletedTasks).toBe(false);
        expect(nativeButton.textContent).toMatch(/show/i);

        nativeButton.click();
        fixture.detectChanges();

        expect(nativeButton.textContent).toMatch(/hide/i);
      });
  }));
});

@Component({
  selector: 'test',
  template: `<task-list></task-list>`,
  directives: [TaskListComponent]
})
class TaskListComponentTestController { }
