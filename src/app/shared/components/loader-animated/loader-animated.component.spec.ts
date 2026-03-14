import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderAnimatedComponent } from './loader-animated.component';

describe('LoaderAnimatedComponent', () => {
  let component: LoaderAnimatedComponent;
  let fixture: ComponentFixture<LoaderAnimatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderAnimatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
