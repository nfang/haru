import { Component } from 'angular2/core';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { TaskProvider } from '../services/mock-tasks';

@Component({
  selector: 'todo-app',
  template: require('./app.component.html'),
  styles: [
    require('normalize.css/normalize.css'),
    require('./app.component.scss')
  ],
  directives: [
    TaskListComponent
  ],
  providers: [
    TaskProvider, TaskService
  ]
})
export class AppComponent {
  ngOnInit() {
    console.log('Todo app is starting up...');
  }
}
