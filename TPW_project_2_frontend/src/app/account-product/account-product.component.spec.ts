import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProductComponent } from './account-product.component';

describe('AccountProductComponent', () => {
  let component: AccountProductComponent;
  let fixture: ComponentFixture<AccountProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
