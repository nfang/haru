import {Injectable} from '@angular/core';

import {Task} from '../task.model';
import {TaskService} from './interfaces';
import {Momento, HistoryService} from './history.service';

class LocalStorageTaskCollection {
  constructor(
    public timestamp: string = (new Date()).toLocaleDateString(),
    public tasks: Task[] = new Array<Task>()
  ) { }
}

@Injectable()
export class LocalStorageTaskService implements TaskService {
  private localStorageKey: string = 'HARU_TASKS';

  taskCollection: LocalStorageTaskCollection;

  private deserialize(value: string): Task {
    let task = Object.assign(new Task(''), value);
    task.checklist = task.checklist.map(item => Object.assign(new Task(''), item));
    return task;
  }

  constructor(private _history: HistoryService) {
    let raw = JSON.parse(localStorage.getItem(this.localStorageKey));
    if (!raw) {
      this.taskCollection = new LocalStorageTaskCollection();
      this.save();
    } else {
      this.taskCollection = new LocalStorageTaskCollection(
        raw.timestamp,
        raw.tasks.map(rawTask => this.deserialize(rawTask))
      );
    }
  }

  list(): Task[] {
    let today = new Date();
    if (today.toLocaleDateString() !== this.taskCollection.timestamp) {
      this.taskCollection = new LocalStorageTaskCollection();
      this.save();
    }
    return this.taskCollection.tasks;
  }

  add(task: Task): number {
    let len = this.taskCollection.tasks.push(task);
    this.save();
    return len;
  }

  remove(task: Task): Task[] {
    if (!task) {
      throw new Error('argument error: invalid task');
    }

    let index = this.taskCollection.tasks.indexOf(task);
    if (index < 0) {
      throw new Error('error: task not found');
    }

    let removed = this.taskCollection.tasks.splice(index, 1);
    this.save();

    let momento = new Momento(removed[0], () => {
      this.add(removed[0]);
    });
    this._history.push(momento);

    return removed;
  }

  update(task: Task): Task {
    if (!task) {
      throw new Error('argument error: invalid task');
    }

    let index = this.taskCollection.tasks.indexOf(task);
    if (index < 0) {
      throw new Error('error: task not found');
    }

    let updated = Object.assign(this.taskCollection.tasks[index], task);
    this.save();

    return updated;
  }

  private save() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.taskCollection));
  }
}
