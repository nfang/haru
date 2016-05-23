import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

import { Task } from '../shared/task.model';
import { TaskService } from '../shared/task.service';

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  styles: [
    require('./task.component.scss')
  ],
  directives: [
    MdIcon, MD_INPUT_DIRECTIVES
  ],
  providers: [
    TaskService, MdIconRegistry
  ],
  host: {
    '[class.expanded]' : 'isExpanded',
    '[class.done]'     : 'task.isCompleted'
  }
})
export class TaskComponent {
  @Input() task: Task;

  isExpanded: boolean;

  constructor(private _taskService: TaskService) {
    this.isExpanded = false;
  }

  toggleCompleted() {
    this.task.isCompleted = !this.task.isCompleted;
    this._taskService.update(this.task);
  }

  togglePrioritised() {
    this.task.isPrioritised = !this.task.isPrioritised;
    this._taskService.update(this.task);
  }

  toggleDetailPane() {
    this.isExpanded = !this.isExpanded;
  }

  addSubtask(task: Task) {
    if (this.task.checklist.includes(task)) {
      throw new Error(`argument error: task with name ${task.title} already exists`);
    }
    this.task.checklist.push(task);
    this._taskService.update(this.task);
  }

  removeSubtask(task: Task): Task[] {
    let index = this.task.checklist.indexOf(task);
    let removed: Task[];
    if (index >= 0) {
      removed = this.task.checklist.splice(index, 1);
      this._taskService.update(this.task);
    }
    return removed;
  }

  remove() {
    this._taskService.remove(this.task);
  }
}
