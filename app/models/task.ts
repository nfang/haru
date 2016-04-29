export class Task {
  // private checklist: Task[];

  isCompleted: boolean;
  isPrioritised: boolean;

  constructor(
    public title: string,
    public createdDate: Date,
    public notes?: string,
    public dueDate?: Date    
  ) { }
}
