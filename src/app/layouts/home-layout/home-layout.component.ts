import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  template: `
    <div class="nav-pane">
      <navi-pane></navi-pane>
    </div>
    <div class="content-pane">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
