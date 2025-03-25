import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosTableComponent } from './agendamentos-table.component';

describe('AgendamentosTableComponent', () => {
  let component: AgendamentosTableComponent;
  let fixture: ComponentFixture<AgendamentosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
