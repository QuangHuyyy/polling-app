import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SvgIcons } from "@ngneat/svg-icon";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { PollService } from "@poll-base/core/services/poll.service";
import { SettingRequest } from "@poll-base/data/schema/request/setting-request.class";
import { HttpErrorResponse } from "@angular/common/http";
import { MultipleChoiceRequest } from "@poll-base/data/schema/request/multiple-choice-request.class";
import { MeetingAnswerRequest } from "@poll-base/data/schema/request/meeting-answer-request.class";
import { HotToastService } from "@ngneat/hot-toast";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { StorageService } from "@poll-base/core/services/storage.service";
import { PollRequest } from "@poll-base/data/schema/request/poll-request.class";

export interface VotingType {
  value: string;
  label: string;
  icon: SvgIcons;
}

export function futureTime(isCreateMode: boolean): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (!isCreateMode) {
      // edit mode
      if (c.pristine) {
        // not modified deadline
        return null;
      }
    }

    const time = c.value;
    const now: Date = new Date();
    if (typeof time == "string") {
      return new Date(time) > now ? null : { noFutureTime: true };
    } else {
      return time ? { noFutureTime: true } : null;
    }
  };
}

export function multipleChoiceValueNotBlank(c: AbstractControl) {
  const choice = c.value;
  const value = choice.value;
  const isOther = choice.isOther;
  if (value == "" && !isOther) {
    return { requiredValue: true };
  }
  return null;
}

export function hasAnswerOption(c: AbstractControl) {
  const answers = c.value;
  let result: any = { noAnswer: true };
  if (answers.length > 0) {
    if (answers[0].hasOwnProperty("value")) {
      answers.forEach((a: { value: string }) => {
        if (a.value != "") {
          result = null;
        }
      });
    } else if (answers[0].hasOwnProperty("image")) {
      answers.forEach((a: { id: number; image: string }) => {
        if (a.image != "" || a.id != -1) {
          result = null;
        }
      });
    } else if (answers[0].hasOwnProperty("date")) {
      return null;
    }
  }
  return result;
}

@Component({
  selector: "app-create-poll",
  templateUrl: "./create-poll.component.html",
  styleUrls: ["./create-poll.component.scss"],
})
export class CreatePollComponent implements OnInit {
  fCreatePoll!: FormGroup;

  isOpenDesc: boolean = false;
  isOpenModalThumbnail: boolean = false;
  isOpenPasteAnswer: boolean = false;
  thumbnailUrl: string = "";
  imageOptionUrl: string[] = [];
  imageChoices = [];
  isCreateMode: boolean = true;
  isDuplicate: boolean = false;
  isShowAdvancedSettings: boolean = false;

  pollUpdate!: PollResponse;
  @ViewChild("pasteAnswerInput") pasteAnswerInput!: ElementRef;
  votingTypes: VotingType[] = [
    {
      label: "Multiple choice",
      value: "multiple_choice",
      icon: "check-circle",
    },
    {
      label: "Image poll",
      value: "image",
      icon: "image-fill",
    },
    {
      label: "Meeting poll",
      value: "meeting",
      icon: "schedule-fill",
    },
  ];
  calendarSelected: Date[] = [];
  votingTypeSelected!: VotingType;

  constructor(
    private formBuilder: FormBuilder,
    private pollService: PollService,
    private storageService: StorageService,
    private toastService: HotToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get answers() {
    return this.fCreatePoll.get("answers") as FormArray;
  }

  get settings() {
    return this.fCreatePoll.get("settings") as FormGroup;
  }

  get votingType() {
    return this.fCreatePoll.get("votingType") as FormControl;
  }

  ngOnInit(): void {
    this.initForm();

    let url: string = this.router.url;

    if (url.includes("/edit")) {
      this.isDuplicate = false;
      this.isCreateMode = false;
      this.setValueFormUpdate();
    } else if (url.includes("/duplicate")) {
      this.isCreateMode = true;
      this.isDuplicate = true;
      let pollUuid: string = this.route.snapshot.params["uuid"];
      if (pollUuid != undefined) {
        this.pollService.getPollByUuid(pollUuid).subscribe({
          next: (poll: PollResponse): void => {
            this.setValueForm(poll);
            if (poll.setting.deadlineTime) {
              if (new Date(poll.setting.deadlineTime).getTime() - new Date().getTime() <= 0) {
                this.settings.get("endDate")?.patchValue(null);
              }
            }
            this.votingTypeSelected = this.getVotingType(poll.votingTypeValue);
          },
          error: (err: HttpErrorResponse): void => {
            if (err.status == 404) {
              this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
            }
          },
        });
      }
    } else {
      this.votingTypeSelected = this.getVotingType("multiple_choice");
    }
  }

  toggleDesc(status: boolean): void {
    this.isOpenDesc = status;
  }

  onChangeVotingType($event: string): void {
    this.votingType.setValue($event);
    this.answers.clear();
    switch ($event) {
      case this.votingTypes[0].value:
        this.answers.push(this.createAnswerMultipleChoice(-1, "", false));
        this.answers.push(this.createAnswerMultipleChoice(-1, "", false));
        break;
      case this.votingTypes[1].value:
        this.answers.push(this.createAnswerImagePoll(-1, "", ""));
        this.answers.push(this.createAnswerImagePoll(-1, "", ""));
        break;
      case this.votingTypes[2].value:
        this.calendarSelected = [];
        break;
    }
  }

  togglePasteAnswers(status: boolean): void {
    if (status && this.pasteAnswerInput) {
      this.pasteAnswerInput.nativeElement.value = this.getValuePasteAnswerMultiple();
    }
    this.isOpenPasteAnswer = status;
  }

  removeThumbnail(): void {
    this.fCreatePoll.get("thumbnail")?.setValue("");
    this.thumbnailUrl = "";
  }

  addAnswer(votingType: string): void {
    if (votingType == "multiple_choice") {
      if (this.checkOtherMultiple()) {
        this.answers.insert(this.answers.length - 1, this.createAnswerMultipleChoice(-1, "", false));
      } else {
        this.answers.push(this.createAnswerMultipleChoice(-1, "", false));
      }
    } else if (votingType == "image") {
      this.answers.push(this.createAnswerImagePoll(-1, "", ""));
    }
  }

  removeAnswerOption(index: number, votingType: string): void {
    if (votingType == "image") {
      this.imageOptionUrl.splice(index, 1);
    }
    this.answers.removeAt(index);
  }

  addOtherMultiple(): void {
    this.answers.push(this.createAnswerMultipleChoice(-1, "Other...", true));
  }

  checkOtherMultiple(): boolean {
    for (let i = 0; i < this.answers.length; i++) {
      if (this.answers.at(i).value.isOther) {
        return true;
      }
    }
    return false;
  }

  getValuePasteAnswerMultiple(): string {
    let result: string = "";
    let listAnswers: { value: string; isOther: boolean }[] = this.answers.getRawValue();

    if (listAnswers[0].value !== "") {
      listAnswers.forEach((a: { value: string; isOther: boolean }) => {
        if (!a.isOther) {
          result = result + a.value + "\n";
        }
      });
    }

    return result.slice(0, -1);
  }

  onClickPreviewPasteAnswerMultiple(): void {
    if (this.pasteAnswerInput) {
      let valuePasteAnswer: string = this.pasteAnswerInput.nativeElement.value;
      let checkOther: boolean = this.checkOtherMultiple();
      this.answers.clear();
      if (valuePasteAnswer.trim() !== "") {
        // Add value from textarea to list answers
        valuePasteAnswer.split("\n").forEach((i) => {
          this.answers.push(this.createAnswerMultipleChoice(-1, i.trim(), false));
        });

        // check has answer other
        if (checkOther) {
          this.addOtherMultiple();
        }
      }

      this.isOpenPasteAnswer = false;
    }
  }

  showAdvancedSetting(): void {
    this.isShowAdvancedSettings = !this.isShowAdvancedSettings;
  }

  onSubmitForm(): void {
    if (this.fCreatePoll.valid) {
      if (this.isCreateMode) {
        if (this.isDuplicate) {
          debugger;
          this.duplicatePoll("live");
        } else {
          this.createPoll("live");
        }
      } else {
        this.updatePoll("live");
      }
    }
  }

  onSaveAsDraft() {
    if (this.fCreatePoll.valid) {
      if (this.isDuplicate) {
        this.duplicatePoll("draft");
        return;
      }
      this.createPoll("draft");
    }
  }

  onCancel(): void {
    this.router.navigateByUrl("/polls/" + this.route.snapshot.params["uuid"]);
  }

  removeDateCalendarSelected(i: number): void {
    this.calendarSelected.splice(i, 1);
    this.removeAnswerMeetingPoll(i);
  }

  addMeetingTimes(index: number): void {
    if (this.meetingTimes(index).at(0).get("from")?.value == "00:00" && this.meetingTimes(index).at(0).get("to")?.value == "23:59") {
      this.meetingTimes(index).removeAt(0);
    }
    let length: number = this.meetingTimes(index).length;
    let hourStr: string =
      length == 0
        ? new Date().getHours().toString()
        : this.meetingTimes(index)
            .at(length - 1)
            .get("to")?.value;

    let hourFrom: number = Number(hourStr.split(":").at(0));
    let hourTo: number = hourFrom + 1;
    this.meetingTimes(index).push(this.newMeetingTime(-1, `${this.convertTime(hourFrom)}:00`, `${this.convertTime(hourTo)}:00`));
  }

  onCalendarSelected($event: { date: Date; isSelected: boolean; index: number }, id: number): void {
    if ($event.isSelected) {
      this.answers.insert($event.index, this.createAnswerMeetingPoll(new Date($event.date.getFullYear(), $event.date.getMonth(), $event.date.getDate(), $event.date.getHours() + 7)));
      this.meetingTimes($event.index).push(this.newMeetingTime(id, "00:00", "23:59"));
    } else {
      this.removeAnswerMeetingPoll($event.index);
    }
  }

  meetingTimes(index: number): FormArray {
    return this.answers.at(index).get("times") as FormArray;
  }

  removeTimeMeeting(indexMeeting: number, indexTime: number): void {
    this.meetingTimes(indexMeeting).removeAt(indexTime);
    if (this.meetingTimes(indexMeeting).length == 0) {
      this.meetingTimes(indexMeeting).push(this.newMeetingTime(-1, "00:00", "23:59"));
    }
  }

  getVotingType(value: string): VotingType {
    return this.votingTypes.find((v: VotingType): boolean => v.value === value) || this.votingTypes[0];
  }

  closeMediaModal($event: boolean): void {
    this.isOpenModalThumbnail = !$event;
  }

  onFileSelected(answerIndex: number, $event: Event) {
    const element: HTMLInputElement = $event.currentTarget as HTMLInputElement;
    // @ts-ignore
    const file: File = element.files.item(0);

    // @ts-ignore
    this.imageChoices.push(file);

    if (file) {
      const mimeType: string = file.type;
      if (mimeType.match(/image\/(jpg|jpeg|png|JPG|JPEG|PNG)$/) == null) {
        element.value = "";
        this.answers.at(answerIndex).value.image = "";
        console.error("File not allow!");
        return;
      } else {
        this.answers.at(answerIndex).value.image = file;

        const reader: FileReader = new FileReader();
        reader.onload = (_event) => {
          this.imageOptionUrl[answerIndex] = _event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  private setValueFormUpdate(): void {
    let pollUuid: string = this.route.snapshot.params["uuid"];
    if (pollUuid != undefined) {
      this.pollService.getPollByUuid(pollUuid).subscribe({
        next: (poll: PollResponse) => {
          this.pollUpdate = poll;
          let currentUserUuid: string | undefined = this.storageService.getUser()?.uuid;
          if (poll.createdBy != currentUserUuid) {
            this.router.navigate(["/not-found"], { state: { message: "Missing permissions!" } });
          }
          this.votingTypeSelected = this.getVotingType(poll.votingTypeValue);
          this.setValueForm(poll);
        },
        error: (err: HttpErrorResponse): void => {
          if (err.status == 404) {
            this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
          }
        },
      });
    }
  }

  private initForm(): void {
    this.fCreatePoll = this.formBuilder.group({
      title: ["", Validators.required],
      thumbnail: "",
      description: "",
      votingType: [this.votingTypes[0].value],
      answers: this.formBuilder.array([this.createAnswerMultipleChoice(-1, "", false), this.createAnswerMultipleChoice(-1, "", false)], { validators: hasAnswerOption }),
      settings: this.formBuilder.group({
        allowMultipleOption: [false],
        requireName: [false],
        votingRestrictions: ["none"],
        endDate: [false, futureTime(this.isCreateMode)],
        allowComments: [false],
        resultsVisibility: ["always"],
        // editVotePermissions: ["nobody"],
        allowEditVote: [false],
      }),
    });

    this.fCreatePoll.get("thumbnail")?.valueChanges.subscribe((value) => {
      if (value) {
        const reader: FileReader = new FileReader();
        reader.onload = (_event) => {
          this.thumbnailUrl = _event.target?.result as string;
        };
        reader.readAsDataURL(value);
      }
    });
    this.answers.valueChanges.subscribe((value) => {
      this.imageOptionUrl.length = value.length;
    });
  }

  private createPoll(status: string): void {
    let pollRequest: PollRequest = this.getValueForm(status, true);

    this.pollService.createPoll(pollRequest).subscribe({
      next: (data: ResponseMessage): void => {
        this.toastService.success("Create new poll successfully.");
        setTimeout(() => this.router.navigateByUrl("/polls/" + data.message), 2000);
      },
      error: (err: HttpErrorResponse): void => {
        this.toastService.error(err.error.detail);
      },
    });
  }

  private updatePoll(status: string): void {
    let pollUuid: string = this.route.snapshot.params["uuid"];

    if (pollUuid != undefined) {
      let pollRequest: PollRequest = this.getValueForm(status, false);
      let imageAnswerIdsNoChange: number[] = [];
      let thumbnailStatus: string;

      if (!pollRequest.thumbnail) {
        // no update new thumbnail
        if (this.thumbnailUrl) {
          // thumbnail no update
          thumbnailStatus = "no_change";
        } else {
          if (this.pollUpdate.thumbnail == null) {
            thumbnailStatus = "no_change";
          } else {
            thumbnailStatus = "deleted";
          }
        }
      } else {
        thumbnailStatus = "new";
      }

      if (pollRequest.votingTypeValue == "image") {
        for (let i: number = 0; i < this.answers.length; i++) {
          if (this.answers.at(i).get("id")?.value != -1) {
            imageAnswerIdsNoChange.push(this.answers.at(i).get("id")?.value);
          }
        }
      }

      this.pollService.updatePoll(pollUuid, pollRequest, thumbnailStatus, imageAnswerIdsNoChange).subscribe({
        next: (poll: PollResponse) => {
          this.router.navigateByUrl("/polls/" + poll.uuid);
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }

  private duplicatePoll(status: string): void {
    let pollRequest: PollRequest = this.getValueForm(status, false);

    let imageAnswersFilename: string[] = [];
    let thumbnailFilename: string | null = null;

    if (!pollRequest.thumbnail) {
      thumbnailFilename = this.thumbnailUrl.split("/").slice(-1).toString();
    }

    if (pollRequest.votingTypeValue == "image") {
      for (let i: number = 0; i < this.answers.length; i++) {
        if (this.answers.at(i).get("id")?.value != -1) {
          // @ts-ignore
          let filename: string = this.imageOptionUrl.at(i).split("/").slice(-1).toString();
          imageAnswersFilename.push(filename);
        }
      }
    }

    this.pollService.duplicatePoll(pollRequest, thumbnailFilename, imageAnswersFilename).subscribe({
      next: (poll: PollResponse) => {
        this.router.navigateByUrl("/polls/" + poll.uuid);
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.error(err.error.detail);
      },
    });
  }

  private getValueForm(status: string, isCreate: boolean): PollRequest {
    let title: string = this.fCreatePoll.get("title")?.value;
    let description: string = this.fCreatePoll.get("description")?.value;
    // @ts-ignore
    let thumb: File = this.fCreatePoll.get("thumbnail")?.value as HTMLInputElement;
    let votingType: string = this.fCreatePoll.get("votingType")?.value;

    let multipleChoiceAnswers: MultipleChoiceRequest[] = [];
    let labels: string[] = [];
    let imageAnswerFiles: any[] = [];
    let meetingAnswers: MeetingAnswerRequest[] = [];

    switch (votingType) {
      case "multiple_choice":
        for (let i: number = 0; i < this.answers.length; i++) {
          let id = this.answers.at(i).get("id")?.value;
          id = id == -1 ? null : id;
          let isOther: boolean = this.answers.at(i).get("isOther")?.value;
          let value: string = isOther ? null : this.answers.at(i).get("value")?.value;

          if (id != null && !isOther) {
            let oldValue: string = this.pollUpdate.choices.filter((c) => c.id == id)[0].value;
            id = value == oldValue ? id : null;
          }

          let choice: MultipleChoiceRequest = new MultipleChoiceRequest(id, value, isOther);
          multipleChoiceAnswers.push(choice);
        }
        break;
      case "image":
        if (isCreate) {
          for (let i: number = 0; i < this.imageChoices.length; i++) {
            labels.push(this.answers.at(i).get("label")?.value);
          }
        } else {
          for (let i: number = 0; i < this.answers.length; i++) {
            labels.push(this.answers.at(i).get("label")?.value);
          }
        }
        imageAnswerFiles = this.imageChoices;
        break;
      case "meeting":
        for (let i: number = 0; i < this.answers.length; i++) {
          let date: Date = this.answers.at(i).get("date")?.value as Date;
          // let dateStr: string = date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" ;
          let dateStr: string = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}T`;
          let timeFrom: string = "";
          let timeTo: string = "";

          if (this.meetingTimes(i).length == 1 && this.meetingTimes(i).at(0).get("from")?.value == "00:00" && this.meetingTimes(i).at(0).get("to")?.value == "23:59") {
            timeFrom = `${dateStr}00:00`;
            timeTo = `${dateStr}23:59`;
            let choice: MeetingAnswerRequest = new MeetingAnswerRequest(null, timeFrom, timeTo);
            meetingAnswers.push(choice);
          } else {
            for (let j: number = 0; j < this.meetingTimes(i).length; j++) {
              timeFrom = dateStr + this.meetingTimes(i).at(j).get("from")?.value;
              timeTo = dateStr + this.meetingTimes(i).at(j).get("to")?.value;
              let id = this.meetingTimes(i).at(j).get("id")?.value;
              id = id == -1 ? null : id;

              let choice: MeetingAnswerRequest = new MeetingAnswerRequest(id, timeFrom, timeTo);
              meetingAnswers.push(choice);
            }
          }
        }
        break;
    }

    let setting: SettingRequest = new SettingRequest(
      this.settings.get("allowMultipleOption")?.value,
      this.settings.get("requireName")?.value,
      this.settings.get("votingRestrictions")?.value,
      this.settings.get("endDate")?.value == false ? null : this.settings.get("endDate")?.value,
      this.settings.get("allowComments")?.value,
      this.settings.get("resultsVisibility")?.value,
      // this.settings.get("editVotePermissions")?.value
      this.settings.get("allowEditVote")?.value
    );
    return new PollRequest(title, description, thumb, votingType, multipleChoiceAnswers, imageAnswerFiles, labels, meetingAnswers, setting, status);
  }

  private convertTime(hour: number): string {
    if (hour < 10) {
      return `0${hour}`;
    } else if (hour > 23) {
      return `0${hour % 24}`;
    } else return hour + "";
  }

  private newMeetingTime(id: number, from: string, to: string): FormGroup {
    return this.formBuilder.group({
      id: id,
      from: from,
      to: to,
    });
  }

  private createAnswerMultipleChoice(id: number, value: string, isOther: boolean): FormGroup {
    return this.formBuilder.group(
      {
        id: [id],
        value: [value],
        isOther: [isOther],
      },
      { validators: multipleChoiceValueNotBlank }
    );
  }

  private createAnswerImagePoll(id: number, image: string, label: string): FormGroup {
    return this.formBuilder.group({
      id: [id],
      image: [image],
      label: [label],
    });
  }

  private createAnswerMeetingPoll(date: Date): FormGroup {
    return this.formBuilder.group({
      date: date,
      times: this.formBuilder.array([]),
    });
  }

  private removeAnswerMeetingPoll(index: number): void {
    this.answers.removeAt(index);
  }

  private setValueForm(poll: PollResponse) {
    this.fCreatePoll.get("title")?.patchValue(poll.title);
    if (poll.description) {
      this.fCreatePoll.get("description")?.patchValue(poll.description);
      this.isOpenDesc = true;
    }

    if (poll.thumbnail) {
      this.thumbnailUrl = poll.thumbnail;
    }
    this.fCreatePoll.get("votingType")?.patchValue(poll.votingTypeValue);

    poll.choices.sort((a, b) => a.id - b.id);
    this.answers.clear();
    switch (poll.votingTypeValue) {
      case "multiple_choice":
        let choices = [];
        for (let i = 0; i < poll.choices.length; i++) {
          let choice = poll.choices.at(i);
          choices.push(choice);
        }

        choices.sort((a, b) => a.other - b.other);
        choices.forEach((choice) => this.answers.push(this.createAnswerMultipleChoice(this.isDuplicate ? -1 : choice.id, choice.value, choice.other)));
        break;
      case "image":
        let imageUrls: string[] = [];
        for (let i = 0; i < poll.choices.length; i++) {
          let choice = poll.choices.at(i);
          this.answers.push(this.createAnswerImagePoll(this.isDuplicate ? -1 : choice.id, "", choice.label));
          imageUrls.push(choice["imageUrl"]);
        }
        this.imageOptionUrl = imageUrls;
        break;
      case "meeting":
        for (let i = 0; i < poll.choices.length; i++) {
          let choice = poll.choices.at(i);
          let date: Date = new Date(choice["timeFrom"]);
          date.setHours(0);
          if (!this.checkDateExistCalendar(date)) {
            this.calendarSelected.push(date);
          }
        }

        for (let i = 0; i < this.calendarSelected.length; i++) {
          let id = this.getIds(poll).at(i);
          this.onCalendarSelected(
            {
              // @ts-ignore
              date: this.calendarSelected.at(i),
              isSelected: true,
              index: i,
            },
            id == undefined ? -1 : id
          );

          for (let j = 0; j < poll.choices.length; j++) {
            let choice = poll.choices.at(j);
            let timeFrom: string = choice["timeFrom"].split("T")[1];
            let timeTo: string = choice["timeTo"].split("T")[1];
            let date: Date = new Date(choice["timeFrom"]);
            date.setHours(0);

            // @ts-ignore
            if (new Date(choice["timeTo"]).getTime() - new Date(choice["timeFrom"]).getTime() != 86340000 && this.calendarSelected.at(i).getTime() - date.getTime() == 0) {
              this.meetingTimes(i).push(this.newMeetingTime(this.isDuplicate ? -1 : choice.id, timeFrom, timeTo));
            }
          }

          if (this.meetingTimes(i).length != 1) {
            this.meetingTimes(i).removeAt(0);
          }
        }
        break;
    }
    this.settings.get("allowMultipleOption")?.patchValue(poll.setting.allowMultipleOptions);
    this.settings.get("requireName")?.patchValue(poll.setting.requireParticipantName);
    this.settings.get("votingRestrictions")?.patchValue(poll.setting.votingRestrictionValue);
    this.settings.get("endDate")?.patchValue(poll.setting.deadlineTime != null ? poll.setting.deadlineTime.split(".")[0] : false);
    this.settings.get("allowComments")?.patchValue(poll.setting.allowComment);
    this.settings.get("resultsVisibility")?.patchValue(poll.setting.resultsVisibilityValue);
    this.settings.get("allowEditVote")?.patchValue(poll.setting.allowEditVote);
  }

  private checkDateExistCalendar(date: Date): boolean {
    for (let i = 0; i < this.calendarSelected.length; i++) {
      // @ts-ignore
      if (date.getTime() - this.calendarSelected.at(i).getTime() == 0) {
        return true;
      }
    }

    return false;
  }

  private getIds(poll: PollResponse): number[] {
    let result: number[] = [];
    poll.choices
      .filter((choice) => {
        let timeFrom: string = choice["timeFrom"].split("T")[1];
        let timeTo: string = choice["timeTo"].split("T")[1];
        if (timeFrom == "00:00" && timeTo == "23:59") {
          return choice;
        }
      })
      .forEach((choice) => result.push(choice["id"]));

    if (poll.choices.at(0)["id"] != result[0]) {
      result.unshift(poll.choices.at(0)["id"]);
    }
    return result;
  }
}
