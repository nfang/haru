export class Task {
  private _isCompleted: boolean = false;
  isPrioritised: boolean = false;
  checklist: Task[];
  private _createAt: Date;

  get createAt(): Date{
    return this._createAt;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value.trim();
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value.trim();
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  set isCompleted(value: boolean) {
    this._isCompleted = !!value;
  }

  constructor(
    private _title: string,
    private _notes: string = ''
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
