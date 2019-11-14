import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  template: `
      <nav *ngIf="pages.length" aria-label="Page navigation">
          <ul class="pagination">
              <li [ngClass]="{disabled:currentPage === 1}" class="page-item first-item">
                  <a (click)="setPage(1)" class="page-link" href="javascript:void(0)">First</a>
              </li>
              <li [ngClass]="{disabled:currentPage === 1}" class="page-item previous-item">
                  <a (click)="setPage(currentPage - 1)" class="page-link" href="javascript:void(0)">Previous</a>
              </li>
              <li *ngFor="let page of pages" [ngClass]="{active:currentPage === page}" class="page-item number-item">
                  <a (click)="setPage(page)" class="page-link" href="javascript:void(0)">{{page}}</a>
              </li>
              <li [ngClass]="{disabled:currentPage === totalPages}" class="page-item next-item">
                  <a (click)="setPage(currentPage + 1)" class="page-link" href="javascript:void(0)">Next</a>
              </li>
              <li [ngClass]="{disabled:currentPage === totalPages}" class="page-item last-item">
                  <a (click)="setPage(currentPage)" class="page-link" href="javascript:void(0)">Last</a>
              </li>
          </ul>
      </nav>`
})

export class PaginationComponent implements OnChanges {
  @Output() pageChanged = new EventEmitter<number>(true);
  @Input() page = 1;
  @Input() pageSize = 15;
  @Input() total = 0;
  @Input() maxPages = 10;

  pages: number[] = [];
  currentPage: number;
  totalPages: number;

  ngOnChanges(changes: SimpleChanges) {
    this.setPage(changes.page.previousValue ? null : this.page);
  }

  public setPage(page?: number) {
    this.totalPages = Math.ceil(this.total / this.pageSize);
    if (!page) {
      page = 1;
    } else if (page > this.totalPages) {
      page = this.totalPages;
    }
    this.currentPage = page;
    const startAt = Math.max(1, page - this.maxPages);
    const size = startAt + this.maxPages > this.totalPages ? this.totalPages : startAt + this.maxPages;
    this.pages = Array.from(new Array(size), (x, i) => i + startAt);

    this.pageChanged.emit(this.currentPage);
  }
}
