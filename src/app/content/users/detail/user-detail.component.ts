import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../user';

@Component({
  selector: 'my-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  public user$: Observable<User>;
  public user: User;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user$ = this.route.data.pipe(switchMap((data) => data.user)) as Observable<User>;
    this.user$.subscribe(user => this.user = user);
  }
}
