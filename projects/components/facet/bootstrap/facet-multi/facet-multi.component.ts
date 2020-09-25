import { Component, OnChanges, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Results } from '@sinequa/core/web-services';
import { AbstractFacet } from '../../abstract-facet';
import { Action } from '@sinequa/components/action';
import { FacetService } from '../../facet.service';

export interface FacetConfig {
  name: string;
  type: 'list' | 'tree';
  title: string;
  icon?: string;
  aggregation: string;
  showCount?: boolean;
  searchable?: boolean;
  allowExclude?: boolean;
  allowOr?: boolean;
  allowAnd?: boolean;
  displayEmptyDistributionIntervals?: boolean;

  // Parameters set by the component
  $count?: string;
  $hasData?: boolean;
  $hasFiltered?: boolean;
}

@Component({
  selector: 'sq-facet-multi',
  templateUrl: './facet-multi.component.html',
  styleUrls: ['./facet-multi.component.scss']
})
export class BsFacetMultiComponent extends AbstractFacet implements OnChanges {

  @Input() results: Results;
  @Input() facets: FacetConfig[];
  @Output() events = new EventEmitter<FacetConfig>();
  @ViewChild("facet", {static: false}) public facetComponent: AbstractFacet;

  /**
   * The facet configuration to open
   */
  openedFacet: FacetConfig | undefined;

  /**
   * Action to switch back from an opened facet to the facet multi view
   */
  backAction: Action;
  clearAllFiltersAction: Action;

  constructor(
    public facetService: FacetService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    super();

    this.backAction = new Action({
      name: "back",
      icon: "fas fa-arrow-left",
      title: "msg#facet.filters.back",
      action: () => {
        this.openedFacet = undefined;
        this.events.next(undefined);
        this.changeDetectorRef.detectChanges();
      }
    });

    this.clearAllFiltersAction = new Action({
      icon: "far fa-minus-square",
      title: "msg#facet.filters.clear",
      action: () => {
        const facetsWithFiltered = this.facets.filter((facet) => facet.$hasFiltered).map(facet => facet.name);
        this.facetService.clearFiltersSearch(facetsWithFiltered, true);
      }
    });

  }

  /**
   * If a sub-facet is opened, add a Back button and forward
   * the actions of the facet.
   */
  get actions(): Action[] {
    const actions: Action[] = [];
    if(this.openedFacet){
      actions.push(this.backAction);
    } else {
      const hasFiltered = this.facets.some(facet => facet.$hasFiltered);
      if (hasFiltered) actions.push(this.clearAllFiltersAction);
    }
    if(this.facetComponent){
      actions.push(...this.facetActions);
    }
    return actions;
  }

  /**
   * Return the actions of the child facet
   */
  get facetActions(): Action[] {
    if(this.facetComponent){
      return this.facetComponent.actions;
    }
    return [];
  }

  /**
   * Open this sub facet
   * @param facet
   */
  openFacet(facet: FacetConfig){
    this.openedFacet = facet;
    this.events.next(facet);
    this.changeDetectorRef.detectChanges();
  }

  clearFacetFilters(facet: FacetConfig, e:Event) {
    e.stopPropagation();
    this.facetService.clearFiltersSearch(facet.name, true);
    return false;
  }

  /**
   * Return the number of items to display for a given facet
   * @param facet
   */
  private getFacetCount(facet: FacetConfig): string {
    if(facet.type==='tree'){
      const agg = this.facetService.getAggregation(facet.aggregation, this.results, {facetName: facet.name});
      if(!agg || !agg.items) return "";
      return agg.items.length + "";
    }
    const agg = this.facetService.getAggregation(facet.aggregation, this.results);
    const count = this.facetService.getAggregationCount(facet.aggregation);
    if (!agg || !agg.items)
      return "";
    const aggItemCounter = (!agg.isDistribution || facet.displayEmptyDistributionIntervals)
      ? agg.items.length
      : agg.items.filter(item => item.count > 0).length;
    return aggItemCounter >= count ? `${count}+` : `${aggItemCounter}`;
  }

  /**
   * Return whether a given facet has data to show
   * @param facet
   */
  private hasData(facet: FacetConfig): boolean {
    if(facet.type==='tree'){
      const agg = this.facetService.getAggregation(facet.aggregation, this.results, {facetName: facet.name});
      return !!agg && !!agg.items && agg.items.length > 0;
    }
    const agg = this.facetService.getAggregation(facet.aggregation, this.results);
    return !!agg && !!agg.items && agg.items.length > 0;
  }

  /**
   * Return whether a given facet has been used in the current context
   * @param facet
   */
  private hasFiltered(facet: FacetConfig): boolean {
    return this.facetService.hasFiltered(facet.name);
  }

  /**
   * When the results change, actualize count, hasData and hasFiltered
   * which are displayed in the template.
   */
  ngOnChanges() {
    this.facets.forEach(facet => {
      facet.$count = this.getFacetCount(facet);
      facet.$hasData = this.hasData(facet);
      facet.$hasFiltered = this.hasFiltered(facet);
    });
    this.changeDetectorRef.detectChanges();
  }

}
