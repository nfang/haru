import { Task } from '../task.model';

export interface TaskService {
  list(): Task[];
  add(task: Task): number;
  remove(task: Task): Task[];
  update(task: Task): Task;
}
