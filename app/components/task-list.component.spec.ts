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
  public tasks: Task[] = []
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
});
