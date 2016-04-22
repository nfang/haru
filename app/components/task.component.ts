import { Component, Input } from 'angular2/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  providers: [
    TaskService
  ]
})
export class TaskComponent {
  @Input()
  task: Task;

  constructor(private _taskService: TaskService) {}

  markComplete() {
    this.task.isCompleted = !this.task.isCompleted;
    this._taskService.update(this.task);
  }
}
