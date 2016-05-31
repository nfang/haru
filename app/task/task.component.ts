import {
  Component,
  Input,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';

import { Task } from '../shared/task.model';
import { TaskService, TASK_SERVICE_TOKEN } from '../shared/services';

export class TaskExpandedEvent {
  constructor(public taskComponent: TaskComponent) {}
}

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  styles: [
    require('./task.component.scss')
  ],
  directives: [
    MdCheckbox, MdIcon, MD_LIST_DIRECTIVES
  ],
  providers: [MdIconRegistry],
  host: {
    '[class.expanded]' : 'isExpanded',
    '[class.done]'     : 'task.isCompleted'
  }
})
export class TaskComponent {
  private _expandEmitter: EventEmitter<TaskExpandedEvent> = new EventEmitter<TaskExpandedEvent>();

  @Input() task: Task;

  @Output('expand')
  get onExpand(): Observable<TaskExpandedEvent> {
    return this._expandEmitter.asObservable();
  }

  isExpanded: boolean;
  subtask: Task;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService
  ) {
    this.isExpanded = false;
    this.subtask = new Task('');
  }

  toggleCompleted() {
    this.task.isCompleted = !this.task.isCompleted;
    if (this.task.isPrioritised) {
      this.task.isPrioritised = false;
    }
    this._taskService.update(this.task);
  }

  togglePrioritised() {
    this.task.isPrioritised = !this.task.isPrioritised;
    this._taskService.update(this.task);
  }

  toggleDetailPane() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this._expandEmitter.emit(new TaskExpandedEvent(this));
    }
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

  updateNotes() {
    if (this.task.notes) {
      this.task.notes = this.task.notes.trim();
      this._taskService.update(this.task);
    }
  }
}
