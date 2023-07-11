import { Component } from '@angular/core';
import { BsFacetDate } from '@sinequa/analytics/timeline';
import { DEFAULT_FACET_COMPONENTS, FacetConfig } from '@sinequa/components/facet';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'doc-facet-filters',
  templateUrl: './facet-filters.component.html'
})
export class DocFacetFiltersComponent extends BaseComponent {

  facets: FacetConfig<any>[] = [
    {
      name: "geo",
      aggregation: "Geo",
      title: "msg#facet.geo.title",
      type: "list",
      icon: "fas fa-fw fa-globe-americas",
      parameters: {
        showCount: true,
        searchable: true,
        focusSearch: true,
        allowExclude: true,
        allowOr: true,
        allowAnd: false,
        displayEmptyDistributionIntervals: false,
      }
    },
    {
      name: "company",
      aggregation: "Company",
      title: "msg#facet.company.title",
      type: "list",
      icon: "fas fa-fw fa-building",
      parameters: {
        showCount: true,
        searchable: true,
        focusSearch: true,
        allowExclude: true,
        allowOr: true,
        allowAnd: false,
        displayEmptyDistributionIntervals: false,
      }
    },
    {
      name: "person",
      aggregation: "Person",
      title: "msg#facet.person.title",
      type: "list",
      icon: "fas fa-fw fa-user",
      parameters: {
        showCount: true,
        searchable: true,
        focusSearch: true,
        allowExclude: true,
        allowOr: true,
        allowAnd: false,
        displayEmptyDistributionIntervals: false,
      }
    },
    {
      name: "modified",
      aggregation: "Modified",
      title: "msg#facet.modified.title",
      type: "date",
      icon: "fas fa-fw fa-calendar-day",
      parameters: {
        timelineAggregation: "Timeline",
        showCount: true,
        allowPredefinedRange: true,
        allowCustomRange: true,
        showCustomRange: true,
        replaceCurrent: true,
        displayEmptyDistributionIntervals: true,
        timelineHeight: 100,
        timelineWidth: 350
      }
    },
  ];

  facetComponents = {
    ...DEFAULT_FACET_COMPONENTS,
    "date": BsFacetDate
  }

  html =
`<nav class="navbar navbar-expand">
  <sq-facet-filters
    [results]="results"
    [facets]="facets"
    [facetComponents]="facetComponents">
  </sq-facet-filters>
</nav>`;

  ts = `facets: FacetConfig<any>[] = [
    {
        name: "geo",
        aggregation: "Geo",
        title: "msg#facet.geo.title",
        type: "list",
        icon: "fas fa-fw fa-globe-americas",
        parameters: {
            showCount: true,
            searchable: true,
            focusSearch: true,
            allowExclude: true,
            allowOr: true,
            allowAnd: false,
            displayEmptyDistributionIntervals: false,
        }
    },
    {
        name: "company",
        aggregation: "Company",
        title: "msg#facet.company.title",
        type: "list",
        icon: "fas fa-fw fa-building",
        parameters: {
            showCount: true,
            searchable: true,
            focusSearch: true,
            allowExclude: true,
            allowOr: true,
            allowAnd: false,
            displayEmptyDistributionIntervals: false,
        }
    },
    {
        name: "person",
        aggregation: "Person",
        title: "msg#facet.person.title",
        type: "list",
        icon: "fas fa-fw fa-user",
        parameters: {
            showCount: true,
            searchable: true,
            focusSearch: true,
            allowExclude: true,
            allowOr: true,
            allowAnd: false,
            displayEmptyDistributionIntervals: false,
        }
    },
    {
        name: "modified",
        aggregation: "Modified",
        title: "msg#facet.modified.title",
        type: "date",
        icon: "fas fa-fw fa-calendar-day",
        parameters: {
            timelineAggregation: "Timeline",
            showCount: true,
            allowPredefinedRange: true,
            allowCustomRange: true,
            showCustomRange: true,
            replaceCurrent: true,
            displayEmptyDistributionIntervals: true,
            timelineHeight: 100,
            timelineWidth: 350
        }
    },
  ];

  facetComponents = {
    ...DEFAULT_FACET_COMPONENTS,
    "date": BsFacetDate
  }
  `;
}
