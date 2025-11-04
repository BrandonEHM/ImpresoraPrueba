import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazEditarProductos } from './interfaz-editar-productos';

describe('InterfazEditarProductos', () => {
  let component: InterfazEditarProductos;
  let fixture: ComponentFixture<InterfazEditarProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterfazEditarProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfazEditarProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
