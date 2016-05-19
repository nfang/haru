import { Component } from '@angular/core';

import { TaskListComponent } from './task-list/task-list.component';
import { TaskService } from './shared/task.service';
import { TaskProvider } from './shared/mock-tasks';

@Component({
  selector: 'todo-app',
  template: require('./app.component.html'),
  styles: [
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
