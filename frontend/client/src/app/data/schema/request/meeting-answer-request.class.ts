export class MeetingAnswerRequest {
  id: number | null;
  timeFrom: string;
  timeTo: string;

  constructor(id: number | null, timeFrom: string, timeTo: string) {
    this.id = id;
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
  }
}
