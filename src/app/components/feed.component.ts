import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AtomFeed} from '../models/atom-feed';
import {finalize} from 'rxjs/operators';
import {AtomEntry} from '../models/atom-entry';
import {TopWord} from '../models/top-word';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html'
})
export class FeedComponent implements OnInit {
  title = 'Feed';
  public feed: AtomFeed;
  public entries: AtomEntry[] = [];
  public topWords: TopWord[] = [];
  ui = {
    loading: false,
    error: null,
    pageSize: 5,
    page: null
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) {

  }

  ngOnInit(): void {
    this.ui.loading = true;
    this.ui.page = parseInt(this.route.snapshot.paramMap.get('page'), 10);
    this.http.get('/feed', {responseType: 'text'}).pipe(
      finalize(() => this.ui.loading = false)
    ).subscribe(xml => {
      const feed = new AtomFeed(xml);
      if (!feed.error) {
        this.feed = feed;
        this.topWords = this.feed.getTopWords(10);
      } else {
        this.ui.error = feed.error;
      }
    }, () => this.ui.error = 'Unable to load feed');
  }

  onPageChange(page) {
    const offset = (page - 1) * this.ui.pageSize;
    this.entries = this.feed.entries.slice(offset, offset + this.ui.pageSize);
    this.location.replaceState('/feed/' + page);
  }

}
