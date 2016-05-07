import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
import { provide } from 'angular2/core';

import { Task } from '../models/task';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { TaskProvider } from '../services/mock-tasks';

class MockTaskProvider {
  public tasks: Task[] = [
    new Task('Task 1', 'Note 1', new Date()),
    new Task('Task 2', 'Note 2', new Date()),
    new Task('Task 3', 'Note 3', new Date())
  ];
}

describe('TaskListComponent', () => {
  beforeEachProviders(() => [
    provide(TaskProvider, { useClass: MockTaskProvider }),
    TaskService,
    TaskListComponent,
  ]);

  it('should log ngOnInit', inject([ TaskListComponent ], (component) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    component.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

  it('should return a list of tasks', inject([ TaskListComponent ], (component) => {
    let tasks = component.tasks;
    expect(tasks.length).toBe(3);
  }));

  it('should return a filtered list of tasks according to query', inject([ TaskListComponent ],
    (component) => {
      component.updateQuery({ value: new Task('3') });
      let tasks = component.tasks;
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toEqual('Task 3');
    }
  ))
});
