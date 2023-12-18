import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditProductComponent } from './account-edit-product.component';

describe('AccountEditProductComponent', () => {
  let component: AccountEditProductComponent;
  let fixture: ComponentFixture<AccountEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEditProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
