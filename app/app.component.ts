import { Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';

import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'todo-app',
  template: require('./app.component.html'),
  styles: [
    require('./app.component.scss')
  ],
  directives: [
    MdCard, TaskListComponent
  ]
})
export class AppComponent {
  today: Date;

  constructor() { }

  ngOnInit() {
    console.log('Todo app is starting up...');
    this.today = new Date();
  }
}
