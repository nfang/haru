import { Component, Input } from 'angular2/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task-editor',
  template: `
    <input [(ngModel)]="task.title">
    <button (click)="addTask()">Add</button>
  `,
  providers: [ TaskService ]
})
export class TaskEditorComponent {
  @Input()
  task: Task;

  constructor(private _taskService: TaskService) {
    this.task = new Task();
  }

  addTask() {
    this.task.dueDate = new Date();
    this._taskService.addTask(this.task);
    this.task = new Task();
  }
}
