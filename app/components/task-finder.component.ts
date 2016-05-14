import { Component, Output, EventEmitter } from 'angular2/core';

import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { TaskProvider } from '../services/mock-tasks';

@Component({
  selector: 'task-finder',
  template: require('./task-finder.component.html')
})
export class TaskFinderComponent {
  @Output() queryUpdated = new EventEmitter();

  task: Task;

  constructor(private _taskService: TaskService) {
    this.task = new Task('');
  }

  onQueryChanged() {
    this.queryUpdated.emit({ value: this.task });
  }

  onSubmit() {
    if (!this.task.title) {
      return;
    }
    this.task.dueDate = new Date();
    this._taskService.add(this.task);
    this.task = new Task('');
  }
}
