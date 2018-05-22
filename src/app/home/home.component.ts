import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { HomeService } from './home.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [

    trigger('goals', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('.6s ease-out', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])

  ]
})
export class HomeComponent implements OnInit {

  btnText: string = 'Add an Item';
  goalText: string = ''; // 'My first life goal';
  goals = []; // ['My first life goal', 'I want to climb a mountain', 'Go ice skiing'];
  itemCount: number = 0;
  foods: any = [];
  foodItem: string;

  constructor(private _data: DataService, private _homeData: HomeService) { }

  ngOnInit() {
    this._data.goal.subscribe(res => this.goals = res);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);
    this.getFoods();
  }

  getFoods() {
    this._homeData.getFoods().subscribe(
      // the first argument is a function which runs on success
      data => { this.foods = data },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading foods')
    );
  }

  addItem() {
    this.goals.push(this.goalText);
    this.itemCount = this.goals.length;
    this.goalText = '';
    this._data.changeGoal(this.goals);
  }

  removeItem(i) {
    this.goals.splice(i, 1);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);
  }

  addFood() {

    let food = { name: this.foodItem };
    this._homeData.createFood(food).subscribe(
      data => {
        // refresh the list
        this.foodItem = '';
        this.getFoods();
        return true;
      },
      error => {
        console.error("Error saving food!");
        return Observable.throw(error);
      }
    );
    // this.goals.push(this.foodItem);
    // this.itemCount = this.goals.length;
    // this.goalText = '';
    // this._data.changeGoal(this.goals);
  }

  removeFood(food) {
    if (confirm("Are you sure you want to delete " + food.name + "?")) {
      this._homeData.deleteFood(food).subscribe(
        data => {
          // refresh the list
          this.getFoods();
          return true;
        },
        error => {
          console.error("Error deleting food!");
          return Observable.throw(error);
        }
      );
    }
  }

}
