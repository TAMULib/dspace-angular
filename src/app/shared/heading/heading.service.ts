import { ElementRef, Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { HeadingComponent } from './heading.component';

// do not change headingElements and HeadlingLevel independently
// they must be exactly the same
export const headingElements = ['h1', 'h2', 'h3', 'h4', 'h5'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export interface Heading {
    id: string;
    level: HeadingLevel;
    component: ElementRef;
    parent?: Heading;
};

@Injectable()
export class HeadingService {
  // todo: decide whether to store structure to validate
  private headings: Map<string, Heading>;

  constructor() {
      this.headings = new Map<string, Heading>();
  }

  public addHeading(component: ElementRef<HeadingComponent>): Heading {
    console.log('adding heading', component);
    const id = uuidv4();
    const level = this.determineLevel(component.nativeElement);

    return { id, level, component };
  }

  public removeHeading(id: string): boolean {
    console.log('removing heading', id);
    // todo: dont forget to remove the hoisted heading if decided to do that todo

    return true;
  }

  private determineLevel(nativeElement: any): HeadingLevel {
    // todo: determine whether to determine the header level
    // determine header level
    // recursively traverse parent elements until a heading element is discovered
    // if heading not hoisted each parent element must check every child
    // element for the heading

    // if order still all messed up
    // query for all heading elements
    // iterate over them
    // go to each leaf looking for nativeElement

    console.log(nativeElement);

    return undefined;
  }
}
