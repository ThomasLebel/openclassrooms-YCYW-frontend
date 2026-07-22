import { TestBed } from '@angular/core/testing';

import { TicketsListService } from './tickets-list-service';

describe('TicketsListService', () => {
  let service: TicketsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
