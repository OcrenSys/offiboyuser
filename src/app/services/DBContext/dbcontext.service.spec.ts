import { TestBed } from '@angular/core/testing';

import { DBContextService } from './dbcontext.service';

describe('DBContextService', () => {
  let service: DBContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
