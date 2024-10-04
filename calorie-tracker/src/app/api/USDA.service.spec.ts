import { TestBed } from '@angular/core/testing';

import { USDAApiService } from './USDAapi.service';

describe('MyApiService', () => {
  let service: USDAApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(USDAApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
