import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEvento } from './registrar-evento';

describe('RegistrarEvento', () => {
  let component: RegistrarEvento;
  let fixture: ComponentFixture<RegistrarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
