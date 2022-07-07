export type Student = {
  firstName: string;
  lastName: string;
  userId: number;
  studentHashKey: string;
};

export type Session = {
  title: string;
  teacherHashKey: string;
  hashKey: string;
  sessionType: string;
  sessionNumber: number;
  students: Student[];
  sessionCountTotal: number;
};

export type Schedule = {
  userId: number;
  firstName: string;
  lastName: string;
  sessions: Session[];
};
