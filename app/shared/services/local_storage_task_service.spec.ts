import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';

import { Task } from '../task.model';
import { LocalStorageTaskService } from './local_storage_task_service';

let localStore: any = {
  "HARU_TASKS": JSON.stringify({
    timestamp: (new Date()).toLocaleDateString(),
    tasks: [
      new Task('Task 1', 'Note 1'),
      new Task('Task 2', 'Note 2')
    ]
  })
};

describe('LocalStorageTaskService', () => {
  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return localStore[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return localStore[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
      localStore = {};
    });
  });

  beforeEachProviders(() => [
    LocalStorageTaskService
  ]);

  it('can list all tasks', inject([LocalStorageTaskService], (service) => {
    let tasks = service.list();
    expect(tasks.every(task => task instanceof Task)).toBe(true);
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
  }));

  it('can add a task to the repository', inject([LocalStorageTaskService], (service) => {
    let len = service.add({ title: 'Task 3', notes: 'Task 3 notes' });
    let tasks = service.list();
    expect(len).toBe(3);
    expect(tasks[2].title).toBe('Task 3');
    expect(tasks[2].notes).toBe('Task 3 notes');
  }));

  it('can remove the specified task from the repository', inject([LocalStorageTaskService], (service) => {
    let tasks = service.list();
    let taskToBeRemoved = tasks[0];
    let removedTasks = service.remove(taskToBeRemoved);
    expect(removedTasks.length).toBe(1);
    expect(removedTasks[0].title).toBe('Task 1');
  }));

  it('can update details of the specified task', inject([LocalStorageTaskService], (service) => {
    const NEW_TITLE = 'Task 1 (edited)';
    let tasks = service.list();
    let taskToUpdate = tasks[0];
    taskToUpdate.title = NEW_TITLE;
    let updatedTask = service.update(taskToUpdate);
    expect(tasks[0].title).toBe(NEW_TITLE);
    expect(updatedTask.title).toBe(NEW_TITLE);
  }));
});
