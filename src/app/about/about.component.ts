import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  goals: any;

  constructor(private route: ActivatedRoute, protected router: Router, private _data: DataService) {
    this.route.params.subscribe(res => console.log(res.id));
    this.route.params.forEach(res => console.log(res.id));
  }

  sendMeHome(): boolean {
    this.router.navigate(['']);
    return false;
  }

  ngOnInit() {
    this._data.goal.subscribe(res => this.goals = res);
  }

}
