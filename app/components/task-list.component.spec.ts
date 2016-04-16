import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';

describe('TaskListComponent', () => {
  beforeEachProviders(() => [
    TaskService, TaskListComponent
  ]);

  it('should log ngOnInit', inject([ TaskListComponent ], (component) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    component.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));
});
