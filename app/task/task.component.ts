import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';

import { Task } from '../shared/task.model';
import { TaskService } from '../shared/services';

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  styles: [
    require('./task.component.scss')
  ],
  directives: [
    MdCheckbox, MdIcon, MD_INPUT_DIRECTIVES, MD_LIST_DIRECTIVES
  ],
  providers: [MdIconRegistry],
  host: {
    '[class.expanded]' : 'isExpanded',
    '[class.done]'     : 'task.isCompleted'
  }
})
export class TaskComponent {
  @Input() task: Task;

  isExpanded: boolean;
  subtask: Task;

  constructor(private _taskService: TaskService) {
    this.isExpanded = false;
    this.subtask = new Task('');
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
    if (task.title) {
      task.title = task.title.trim();
      this.task.addSubtask(task);
      this._taskService.update(this.task);
      this.subtask = new Task('');
    }
  }

  removeSubtask(task: Task) {
    this.task.removeSubtask(task);
    this._taskService.update(this.task);
  }

  remove() {
    this._taskService.remove(this.task);
  }
}
