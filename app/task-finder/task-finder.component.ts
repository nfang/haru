import { Component, Output, EventEmitter } from '@angular/core';
import {MdInput} from '@angular2-material/input';


import { Task } from '../shared/task.model';
import { TaskService } from '../shared/task.service';
import { TaskProvider } from '../shared/mock-tasks';

@Component({
  selector: 'task-finder',
  template: require('./task-finder.component.html'),
  styles: [
    require('./task-finder.component.scss')
  ],
  directives: [MdInput]
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
