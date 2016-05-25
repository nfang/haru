export class Task {
  isCompleted: boolean = false;
  isPrioritised: boolean = false;
  checklist: Task[];
  private _createAt: Date;

  get createAt(): Date{
    return this._createAt;
  }

  constructor(
    public title: string,
    public notes: string = ''
  ) {
    this._createAt = new Date();
    this.checklist = new Array<Task>();
  }

  addSubtask(task: Task): number {
    if (this.checklist.filter(t => t.title === task.title).length) {
      console.error(`argument error: task with name ${task.title} already exists`);
      return;
    }
    return this.checklist.push(task);
  }

  removeSubtask(task: Task): Task[] {
    let index = this.checklist.indexOf(task);
    if (index < 0) {
      return [];
    }
    return this.checklist.splice(index, 1);
  }
}
