import { Task } from './task.model';
import { FormControl } from '@angular/forms';
import { TaskValidators } from './task-validators';

describe('TaskValidators', () => {
  let tasks: Task[];
  let query: FormControl;

  beforeEach(() => {
    tasks = [
      new Task('Task 1', 'Note 1'),
      new Task('Task 2', 'Note 2'),
      new Task('Task 3', 'Note 3')
    ];
  });

  it('raise error when tasks with the same title already exists', () => {
    query = new FormControl('Task 1', TaskValidators.validateTitle(tasks));
    expect(query.errors['taskTitleTaken']).toBe(true);
  });

  it('clear errors when the task title is unique', () => {
    query = new FormControl('Task 4', TaskValidators.validateTitle(tasks));
    expect(query.errors).toBe(null);
  });
});
