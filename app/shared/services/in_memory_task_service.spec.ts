import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';

import { Task } from '../task.model';
import {
  InMemoryTaskProvider,
  InMemoryTaskService
} from './in_memory_task_service';
import { HistoryService } from './history.service';

class MockInMemoryTaskProvider {
  public tasks: Task[] = [
    new Task('Task 1', 'Note 1'),
    new Task('Task 2', 'Note 2')
  ];
}

describe('InMemoryTaskService', () => {
  beforeEachProviders(() => [
    provide(InMemoryTaskProvider, { useClass: MockInMemoryTaskProvider }),
    InMemoryTaskService,
    HistoryService
  ]);

  it('can list all tasks', inject([ InMemoryTaskService ], (service) => {
    let tasks = service.list();
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
  }));

  it('can add a task to the repository', inject([ InMemoryTaskService ], (service) => {
    let due = new Date(2016, 6, 14);
    let len = service.add({ title: 'Task 3', notes: 'Task 3 notes', dueDate: due });
    let tasks = service.list();
    expect(len).toBe(3);
    expect(tasks[2].title).toBe('Task 3');
    expect(tasks[2].notes).toBe('Task 3 notes');
    expect(tasks[2].dueDate).toBe(due);
  }));

  it('can remove the specified task from the repository', inject([ InMemoryTaskService ], (service) => {
    let tasks = service.list();
    let taskToBeRemoved = tasks[0];
    let removedTasks = service.remove(taskToBeRemoved);
    expect(removedTasks.length).toBe(1);
    expect(removedTasks[0].title).toBe('Task 1');
  }));

  it('can update details of the specified task', inject([ InMemoryTaskService], (service) => {
    const NEW_TITLE = 'Task 1 (edited)';
    let tasks = service.list();
    let taskToUpdate = tasks[0];
    taskToUpdate.title = NEW_TITLE;
    let updatedTask = service.update(taskToUpdate);
    expect(tasks[0].title).toBe(NEW_TITLE);
    expect(updatedTask.title).toBe(NEW_TITLE);
  }));
});
