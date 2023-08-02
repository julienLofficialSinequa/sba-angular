import { Component, OnInit } from '@angular/core';
import { QueryIntentService } from '../query-intent.service';
 
@Component({
  selector: 'app-query-intent-people',
  templateUrl: './query-intent-people.component.html',
  styleUrls: ['./query-intent-people.component.scss']
})
export class QueryIntentPeopleComponent implements OnInit {
 
  constructor(
    public queryIntentService: QueryIntentService
  ) { }
 
  ngOnInit(): void {
  }
 
}