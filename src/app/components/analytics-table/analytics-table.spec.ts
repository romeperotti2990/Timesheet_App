import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTable } from './analytics-table';

describe('AnalyticsTable', () => {
  let component: AnalyticsTable;
  let fixture: ComponentFixture<AnalyticsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
