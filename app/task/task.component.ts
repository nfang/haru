import {
  Component,
  Input,
  Inject,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';

import { Task } from '../shared/task.model';
import {
  HistoryService,
  TaskService,
  TASK_SERVICE_TOKEN
} from '../shared/services';
import { SubtaskComponent } from '../subtask/subtask.component';
import { EditableComponent } from '../editable/editable.component';

export class TaskExpandedEvent {
  constructor(public taskComponent: TaskComponent) { }
}

@Component({
  selector: 'task',
  template: require('./task.component.html'),
  styles: [
    require('./task.component.scss')
  ],
  directives: [
    MdCheckbox,
    MdIcon,
    MD_LIST_DIRECTIVES,
    EditableComponent,
    SubtaskComponent
  ],
  providers: [MdIconRegistry],
  host: {
    '[class.expanded]': 'isExpanded',
    '[class.done]': 'task.isCompleted',
    '[class.completing]': 'isCompleting'
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
  isCompleting: boolean;
  subtask: Task;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService,
    private _historyService: HistoryService,
    private _elementRef: ElementRef
  ) {
    this.isExpanded = false;
    this.isCompleting = false;
    this.subtask = new Task('');
  }

  ngAfterViewInit() {
    let el = this._elementRef.nativeElement;
    Observable.fromEvent(el, 'transitionend')
      .filter(e => el.classList.contains('completing'))
      .delay(1000)
      .subscribe((e) => {
        this.isCompleting = false;
        if (!this.task.isCompleted) {
          this.task.isCompleted = true;
          if (this.task.isPrioritised) {
            this.task.isPrioritised = false;
          }
          this.save();
        }
      });
  }

  toggleCompleted(event) {
    if (!this.task.isCompleted) {
      this.isCompleting = true;
    } else {
      this.task.isCompleted = false;
      this.save();
    }
    event.stopPropagation();
  }

  togglePrioritised(event) {
    this.task.isPrioritised = !this.task.isPrioritised;
    this.save();
    event.stopPropagation();
  }

  toggleDetailPane() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this._expandEmitter.emit(new TaskExpandedEvent(this));
    }
  }

  addSubtask(subtask: Task) {
    if (subtask.title) {
      this.task.addSubtask(subtask);
      this.save();
      this.subtask = new Task('');
    }
  }

  removeSubtask(subtask: Task) {
    this._historyService.registerRemoval(() => {
      this.task.addSubtask(subtask);
      this.save();
    });
    this.task.removeSubtask(subtask);
    this.save();
  }

  remove(event) {
    this._historyService.registerRemoval(() => {
      this._taskService.add(this.task);
    });
    this._taskService.remove(this.task);
    event.stopPropagation();
  }

  save() {
    this._taskService.update(this.task);
  }
}
