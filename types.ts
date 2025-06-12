
export enum DirectiveStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export interface Directive {
  id: string;
  title: string;
  type: string;
  assignedDate: string; // ISO date string
  dueDate: string;      // ISO date string
  status: DirectiveStatus;
  userReport: string | null;
  mistressAppraisal: string | null;
}

export interface Database {
  directives: Directive[];
}
