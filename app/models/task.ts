export class Task {
  // private checklist: Task[];

  isCompleted: boolean;
  isPrioritised: boolean;

  constructor(
    public title: string,
    public notes?: string,
    public dueDate?: Date
  ) { }
}
