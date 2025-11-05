import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarProducto } from './modal-agregar-producto';

describe('ModalAgregarProducto', () => {
  let component: ModalAgregarProducto;
  let fixture: ComponentFixture<ModalAgregarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
