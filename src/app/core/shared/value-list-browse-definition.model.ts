import { inheritSerialization, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { VALUE_LIST_BROWSE_DEFINITION } from './value-list-browse-definition.resource-type';
import { ResourceType } from './resource-type';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { HALLink } from './hal-link.model';

/**
 * BrowseDefinition model for browses of type 'valueList'
 */
@typedObject
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class ValueListBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static type = VALUE_LIST_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = VALUE_LIST_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
  };

  getRenderType(): string {
    // TAMU Customization - return type.value of `valueList` to properly render author browse by link in simple item view
    return this.type.value;
    // return this.dataType;
  }
}
