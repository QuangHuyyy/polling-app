import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateAgo",
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string): string {
    // const time = new Date(value);
    // const now = new Date();
    // const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    //
    // if (seconds < 60) {
    //   return "just now";
    // } else if (seconds < 120) {
    //   return "a minute ago";
    // } else if (seconds < 3600) {
    //   return Math.floor(seconds / 60) + " minutes ago";
    // } else if (seconds < 7200) {
    //   return "an hour ago";
    // } else if (seconds < 86400) {
    //   return Math.floor(seconds / 3600) + " hours ago";
    // } else {
    //   return time.toLocaleString();
    // }

    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29)
        // less than 30 seconds ago will show as 'Just now'
        return "Just now";
      const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + " " + i + " ago"; // singular (1 day ago)
          } else {
            return counter + " " + i + "s ago"; // plural (2 days ago)
          }
      }
    }
    return value;
  }
}
