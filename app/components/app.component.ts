import { Component } from 'angular2/core';
import { TaskFinderComponent } from './task-finder.component';

@Component({
  selector: 'todo-app',
  templateUrl: 'components/app.component.html',
  directives: [
    TaskFinderComponent
  ]
})
export class AppComponent {
  ngOnInit() {
    console.log('Todo app is starting up...');
  }
}
