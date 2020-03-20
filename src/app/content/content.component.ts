import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
