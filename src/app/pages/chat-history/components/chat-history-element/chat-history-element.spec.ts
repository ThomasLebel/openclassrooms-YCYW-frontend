import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHistoryElement } from './chat-history-element';

describe('ChatHistoryElement', () => {
  let component: ChatHistoryElement;
  let fixture: ComponentFixture<ChatHistoryElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHistoryElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatHistoryElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
