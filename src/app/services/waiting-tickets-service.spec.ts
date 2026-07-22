import { TestBed } from '@angular/core/testing';

import { WaitingTicketsService } from './waiting-tickets-service';

describe('WaitingTicketsService', () => {
  let service: WaitingTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaitingTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
