import { Component } from 'angular2/core';
import { TaskListComponent } from './components/task-list.component';
import { TaskEditorComponent } from './components/task-editor.component';

@Component({
  selector: 'todo-app',
  template: `
    <tasks></tasks>
    <task-editor></task-editor>
  `,
  directives: [
    TaskListComponent,
    TaskEditorComponent
  ]
})
export class AppComponent {
  ngOnInit() {
    console.log('Todo app is starting up...');
  }
}
