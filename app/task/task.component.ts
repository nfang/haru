import { Component, Input } from '@angular/core';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

import { Task }             from '../shared/task.model';
import { TaskService }      from '../shared/task.service';

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  styles: [
    require('./task.component.scss')
  ],
  directives: [
    MdIcon
  ],
  providers: [
    TaskService, MdIconRegistry
  ]
})
export class TaskComponent {
  @Input() task: Task;

  constructor(private _taskService: TaskService) {}

  markCompleted() {
    this.task.isCompleted = !this.task.isCompleted;
    this._taskService.update(this.task);
  }

  togglePrioritised() {
    this.task.isPrioritised = !this.task.isPrioritised;
    this._taskService.update(this.task);
  }

  removeTask() {
    this._taskService.remove(this.task);
  }
}
