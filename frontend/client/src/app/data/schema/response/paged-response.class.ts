export class PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  first: boolean;
  last: boolean;

  constructor(content: T[], page: number, size: number, totalElements: number, totalPages: number, currentPage: number, first: boolean, last: boolean) {
    this.content = content;
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.first = first;
    this.last = last;
  }
}
