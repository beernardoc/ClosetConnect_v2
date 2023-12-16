import { TestBed } from '@angular/core/testing';

import { LogoutUserService } from './logout-user.service';

describe('LogoutUserService', () => {
  let service: LogoutUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
