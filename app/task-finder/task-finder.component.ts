import { Component, Output, EventEmitter } from '@angular/core';

import { Task } from '../shared/task.model';
import { TaskService } from '../shared/task.service';
import { TaskProvider } from '../shared/mock-tasks';

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
