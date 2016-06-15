import { Control, AbstractControl } from '@angular/common';
import { Task } from '../shared/task.model';
import { ValidatorFn } from '@angular/common/src/forms/directives/validators';

export class taskTitleValidator {

    static checkTaskTitle(tasks: Task[]): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
        if(tasks.filter(t => t.title === control.value).length) {
            return {'taskTitleTaken': true};
        }
        return null;
        }
    }
}