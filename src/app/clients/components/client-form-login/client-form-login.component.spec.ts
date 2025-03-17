import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormLoginComponent } from './client-form-login.component';

describe('ClientFormLoginComponent', () => {
  let component: ClientFormLoginComponent;
  let fixture: ComponentFixture<ClientFormLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFormLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFormLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
