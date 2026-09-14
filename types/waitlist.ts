export interface WaitlistEntry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  paxCount: number;
  createdAt: string;
}

export interface WaitlistFormInput {
  fullName: string;
  phone: string;
  email: string;
  paxCount: number;
}
