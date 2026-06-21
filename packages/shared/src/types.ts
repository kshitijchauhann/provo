export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Commitment {
  id: string;
  text: string;
  deadline: string;
  status: 'active' | 'completed' | 'postponed' | 'broken';
}
