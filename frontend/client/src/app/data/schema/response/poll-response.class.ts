import { SettingResponse } from "@poll-base/data/schema/response/setting-response.class";

export class PollResponse {
  uuid: string;
  title: string;
  description: string;
  thumbnail: string;
  votingTypeValue: string;
  choices: any[];
  setting: SettingResponse;
  ownerName: string;
  createdBy: string;
  createdAt: string;
  participants: number;
  status: string;

  constructor(
    uuid: string,
    title: string,
    description: string,
    thumbnailUrl: string,
    votingTypeValue: string,
    choices: any[],
    setting: SettingResponse,
    ownerName: string,
    createdBy: string,
    createdAt: string,
    participants: number,
    status: string
  ) {
    this.uuid = uuid;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnailUrl;
    this.votingTypeValue = votingTypeValue;
    this.choices = choices;
    this.setting = setting;
    this.ownerName = ownerName;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.participants = participants;
    this.status = status;
  }
}
