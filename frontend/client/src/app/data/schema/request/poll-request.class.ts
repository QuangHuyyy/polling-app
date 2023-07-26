import { MultipleChoiceRequest } from "@poll-base/data/schema/request/multiple-choice-request.class";
import { MeetingAnswerRequest } from "@poll-base/data/schema/request/meeting-answer-request.class";
import { SettingRequest } from "@poll-base/data/schema/request/setting-request.class";

export class PollRequest {
  title: string;
  description: string;
  thumbnail: File;
  votingTypeValue: string;
  multipleChoiceAnswers: MultipleChoiceRequest[];
  imageAnswers: any[];
  labels: string[];
  meetingAnswers: MeetingAnswerRequest[];
  settings: SettingRequest;
  status: string;

  constructor(
    title: string,
    description: string,
    thumbnail: File,
    votingTypeValue: string,
    multipleChoiceAnswers: MultipleChoiceRequest[],
    imageAnswers: any[],
    labels: string[],
    meetingAnswers: MeetingAnswerRequest[],
    settings: SettingRequest,
    status: string
  ) {
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.votingTypeValue = votingTypeValue;
    this.multipleChoiceAnswers = multipleChoiceAnswers;
    this.imageAnswers = imageAnswers;
    this.labels = labels;
    this.meetingAnswers = meetingAnswers;
    this.settings = settings;
    this.status = status;
  }
}
