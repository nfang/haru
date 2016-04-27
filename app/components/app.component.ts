import { Component } from 'angular2/core';

import { TaskFinderComponent } from './task-finder.component';

@Component({
  selector: 'todo-app',
  template: require('./app.component.html'),
  styles: [
    require('normalize.css/normalize.css'),
    require('./app.component.scss')
  ],
  directives: [
    TaskFinderComponent
  ]
})
export class AppComponent {
  ngOnInit() {
    console.log('Todo app is starting up...');
  }
}
