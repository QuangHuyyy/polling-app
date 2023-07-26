export class MultipleChoiceRequest {
  id: number | null;
  value: string;
  other: boolean;

  constructor(id: number | null, value: string, other: boolean) {
    this.id = id;
    this.value = value;
    this.other = other;
  }
}
