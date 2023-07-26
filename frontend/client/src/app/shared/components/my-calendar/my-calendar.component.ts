import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-my-calendar",
  templateUrl: "./my-calendar.component.html",
  styleUrls: ["./my-calendar.component.scss"],
})
export class MyCalendarComponent implements OnInit {
  days: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  DAY_MS: number = 24 * 60 * 60 * 1000;

  now: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  date: Date = new Date();
  dates: Date[] = [];

  @Input() selectedDates: Date[] = [];
  @Output() selectedDatesChange: EventEmitter<{ date: Date; isSelected: boolean; index: number }> = new EventEmitter<{ date: Date; isSelected: boolean; index: number }>();

  constructor() {
    this.dates = this.getCalendarDays(this.now);
    // Chuẩn hóa calendar
    if (this.dates[35].getMonth() !== this.now.getMonth()) {
      this.dates.splice(35, 7);
    }
  }

  ngOnInit(): void {}

  setMonth(value: number): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + value, 1);
    this.dates = this.getCalendarDays(this.date);
    // Chuẩn hóa calendar
    if (this.dates[35].getMonth() !== this.date.getMonth()) {
      this.dates.splice(35, 7);
    }
  }

  isSameMonth(date: Date): boolean {
    return this.date.getMonth() === date.getMonth();
  }

  isToday(date: Date): boolean {
    return this.now.getFullYear() === date.getFullYear() && this.now.getMonth() === date.getMonth() && this.now.getDate() === date.getDate();
  }

  isPrevDate(date: Date): boolean {
    return this.now.getTime() > date.getTime();
  }

  isSelectedDate(date: Date): boolean {
    if (this.selectedDates == null) {
      return false;
    }
    for (let i: number = 0; i < this.selectedDates.length; i++) {
      if (this.selectedDates[i].getFullYear() === date.getFullYear() && this.selectedDates[i].getMonth() === date.getMonth() && this.selectedDates[i].getDate() === date.getDate()) {
        return true;
      }
    }
    return false;
  }

  toggleSelectDate($event: MouseEvent, date: Date): void {
    let btn: HTMLButtonElement = $event.target as HTMLButtonElement;
    const className: string = "isSelectedDate";
    const hasClass: boolean = btn.classList.contains(className);
    let index: number;
    if (hasClass) {
      btn.classList.remove(className);
      index = this.selectedDates.findIndex((d: Date): boolean => d == date);
      this.selectedDates.splice(this.selectedDates.indexOf(date), 1);
    } else {
      btn.classList.add(className);
      this.selectedDates.push(date);
      this.sortSelectedDates();
      index = this.selectedDates.findIndex((d: Date): boolean => d == date);
    }
    this.selectedDates.map((d) => d.setHours(0));
    this.selectedDatesChange.emit({ date: date, isSelected: !hasClass, index: index });
  }

  getCalendarDays(date: Date = new Date()): Date[] {
    const calendarStartTime: number = this.getCalendarStartDay(date).getTime();

    return this.createArray(0, 41).map((num: number) => new Date(calendarStartTime + this.DAY_MS * num));
  }

  // Ngày đầu tiên của lịch
  private getCalendarStartDay(date: Date = new Date()): Date {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();

    const timeFirstStartDayOfCurrentMonth: number = new Date(year, month, 1).getTime();
    return (
      this.createArray(1, 7)
        .map((num: number) => new Date(timeFirstStartDayOfCurrentMonth - this.DAY_MS * num))
        .find((d: Date): boolean => d.getDay() === 0) || date
    );
  }

  private createArray(start: number, end: number, length: number = end - start + 1): number[] {
    return Array.from({ length }, (item: number, index: number) => start + index);
  }

  private sortSelectedDates(): void {
    for (let i: number = 1; i < this.selectedDates.length; i++) {
      let key: Date = this.selectedDates[i];
      let j: number = i - 1;
      while (j >= 0 && this.selectedDates[j] > key) {
        this.selectedDates[j + 1] = this.selectedDates[j];
        j = j - 1;
      }
      this.selectedDates[j + 1] = key;
    }
  }
}
