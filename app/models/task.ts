export class Task {
  // private checklist: Task[];

  isCompleted: boolean;
  isPrioritised: boolean;
  private _createAt: Date;
  get createAt(){
    return this._createAt;
  }

  constructor(
    public title: string,
    public notes?: string,
    public dueDate?: Date 
  ) { this._createAt = new Date(); }
}
