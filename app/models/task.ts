export class Task {
  // private checklist: Task[];

  constructor(
    public title: string,
    public notes?: string,
    public dueDate?: Date
  ) { }
}
