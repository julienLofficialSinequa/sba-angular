import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryIntentPeopleComponent } from './query-intent-people.component';

describe('QueryIntentPeopleComponent', () => {
  let component: QueryIntentPeopleComponent;
  let fixture: ComponentFixture<QueryIntentPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryIntentPeopleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryIntentPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
