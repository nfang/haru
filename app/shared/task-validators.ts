import { AbstractControl } from '@angular/forms';
import { Task } from '../shared/task.model';
// import { ValidatorFn } from '@angular/common/src/forms-deprecated/directives/validators';

export class TaskValidators {

  static validateTitle(tasks: Task[]) {
    return (control: AbstractControl): { [key: string]: any } => {
      let target = new Task(control.value);
      if (tasks.filter(t => t.equals(target)).length) {
        return { 'taskTitleTaken': true };
      }
      return null;
    }
  }
}
