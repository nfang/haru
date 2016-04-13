import { Component } from 'angular2/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'tasks',
  templateUrl: 'components/task-list.component.html',
  providers: [ TaskService ]
})
export class TaskListComponent {
  tasks: Task[];

  constructor(private _taskService: TaskService) { }

  ngOnInit() {
    this.tasks = this._taskService.listTasks();
  }
}
