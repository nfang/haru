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
    public notes?: string,
    public dueDate?: Date
  ) {
    this._createAt = new Date();
    this.checklist = new Array<Task>();
  }
}
