import { TestBed } from '@angular/core/testing';

import { QueryIntentService } from './query-intent.service';

describe('QueryIntentService', () => {
  let service: QueryIntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryIntentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
