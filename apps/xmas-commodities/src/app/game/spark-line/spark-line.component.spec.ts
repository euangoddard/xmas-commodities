import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparkLineComponent } from './spark-line.component';

describe('SparkLineComponent', () => {
  let component: SparkLineComponent;
  let fixture: ComponentFixture<SparkLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparkLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
