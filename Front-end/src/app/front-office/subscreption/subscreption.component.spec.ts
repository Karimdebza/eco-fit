import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscreptionComponent } from './subscreption.component';

describe('SubscreptionComponent', () => {
  let component: SubscreptionComponent;
  let fixture: ComponentFixture<SubscreptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscreptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscreptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
