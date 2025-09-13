import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { HeadingLevel, HeadingService } from './heading.service';

@Component({
  selector: 'ds-heading',
  templateUrl: './heading.component.html',
  standalone: true,
  providers: [ HeadingService ],
})
export class HeadingComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public level: HeadingLevel;

  @Input()
  public id: string;

  @Input()
  public class: string;

  @Input({ required: true })
  public text!: string;

  private _id: string;

  constructor(
    readonly elementRef: ElementRef,
    readonly headingService: HeadingService
  ) {
    this.id = null;
  }

  ngOnInit(): void {
    console.log('initializing heading');
    const heading = this.headingService.addHeading(this.elementRef);
    console.log('heading initialized', heading);
    this._id = heading.id;
  }

  ngAfterViewInit() {
    // todo: determine whether to hoist heading element
  }

  ngOnDestroy(): void {
    console.log('destroying heading');
    const removed = this.headingService.removeHeading(this._id);
    console.log('heading destroyed', removed);
  }
}
