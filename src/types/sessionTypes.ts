export type Student = {
  firstName: string;
  lastName: string;
  userId: number;
  studentHashKey: string;
};

export type Campus = {
  modelKey: number;
  name: string;
  timeZoneInfoId: string;
  hashKey: string;
  iana: string;
  created: string;
};

export type Series = {
  modelKey: string;
  hashKey: string;
  title: string;
  description: string;
  repeatConfiguration: string;
  recurrenceRule: unknown;
  allDay: boolean;
  recurrence: boolean;
  type: number;
  allowOverlap: boolean;
  skipNonServiceDays: boolean;
  repeatType: string;
  playCode: number;
  kind: string;
  campus: Campus;
};

export type Session = {
  teacherHashKey: string;
  teacherReservationInstanceId: number;
  sessionType: string;
  sessionSubType: string;
  sessionTitle: string;
  sessionSubtitle: string;
  startTime: string;
  endTime: string;
  sessionNumber: number;
  sessionCountTotal: number;
  actualNumberOfCurrentScheduledSessions: number;
  numberOfStudents: number;
  deliveryMethod: string;
  curriculumLevel: string;
  payCode: string;
  isDiscretionary: boolean;
  studentFirstName: string;
  studentLastName: string;
  isCanceledSession: false;
  status: string;
  room: unknown;
  title: string;
  referenceNumber: string;
  dayOfWeek: string;
  appointmentStyle: string;
  availabilityStyle: unknown;
  overlapsAnotherInstanceTimeSlot: boolean;
  overlapsAnotherInstanceUser: boolean;
  overlapsAnotherInstanceStudent: boolean;
  overlapsAnotherInstanceTimeSlotRangeAndUser: boolean;
  overlapsAnotherInstanceTimeSlotRangeAndStudent: boolean;
  series: Series;
  students: Student[];
  hashKey: string;
};

export type Schedule = {
  userId: number;
  firstName: string;
  lastName: string;
  sessions: Session[];
};

export type CampusHashKey = {
  defaultCampusHashKey: string;
};

export type UserInformation = {
  earnedPlanningTime: {
    planningTimeBalanceMinutes: number;
    usedPlanningTimeMinutes: number;
  },
};