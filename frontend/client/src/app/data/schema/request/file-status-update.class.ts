export class FileStatusUpdate {
  filename: string;
  status: string;

  constructor(filename: string, status: string) {
    this.filename = filename;
    this.status = status;
  }
}
