import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from "@angular/core";
import { Action } from "@sinequa/components/action";
import { SearchService } from "@sinequa/components/search";
import { UIService } from "@sinequa/components/utils";
import { Query } from "@sinequa/core/app-utils";
import { EntityItem, Filter, isValueFilter, Record } from "@sinequa/core/web-services";
import { MetadataService } from "../../../../../components/metadata/metadata.service";
import { MetadataItem, MetadataValue } from "../../../../../components/metadata/metadata.interface";
import { Observable, map, of } from "rxjs";
import { SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'app-smiley',
  templateUrl: './smiley.component.html',
  styleUrls: ['./smiley.component.scss']
})
export class SmileyComponent implements OnChanges, OnDestroy {
    @Input() record: Record;
    @Input("query") _query?: Query;
    @Input() layout: 'inline' | 'table' = 'inline';

    @Input() field: string;
    @Input() label?: string
    @Input() icon?: string;
    @Input() fieldClass?: string;
    @Input() filterable?: boolean;
    @Input() excludable?: boolean;
    @Input() showEntityExtract?: boolean;
    @Input() actions?: Action[];

    @Input() collapseRows: boolean = true;
    @Input() entityExtractMaxLines = 4;

    @Input() actionsButtonsStyle = 'btn btn-secondary';
    @Input() actionsButtonsSize = 'sm';

    @ViewChild('values') valuesEl: ElementRef<HTMLElement>;

    metadataValue: MetadataValue;
    needsCollapse: boolean = false;
    collapsed: boolean = true;
    finalValue:string = "";

    get query(): Query {
        return this._query || this.searchService.query;
    }

    constructor(
        private metadataService: MetadataService,
        private searchService: SearchService,
        private el: ElementRef,
        private ui: UIService
    ) {
        this.ui.addElementResizeListener(this.el.nativeElement, this.onResize);
    }

    onResize = () => this.updateCollapsed()

    ngOnChanges(changes: SimpleChanges) {
        // Generate the metadata data
        if (changes.record || changes.query || changes.field || changes.showEntityExtract) {
            this.metadataValue = this.metadataService.getMetadataValue(this.record, this.query, this.field, this.showEntityExtract);
            this.regroupEmotions();
        }

        this.needsCollapse = false;
        this.collapsed = !!this.collapseRows;
    }

    ngOnDestroy(): void {
        this.ui.removeElementResizeListener(this.el.nativeElement, this.onResize);
    }

    filterItem(item: MetadataItem, remove?: boolean, not?: boolean): void {
        if (remove) {
            this.query.removeFilters(f => isValueFilter(f) && f.field === this.field && f.value === item.value);
        } else {
            let filter: Filter = {field: this.field, value: item.value, display: item.display};
            if(not) {
              filter = {operator: 'not', filters: [filter]};
            }
            this.query.addFilter(filter);
        }
        this.searchService.search();
    }

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
    }

    getTooltip = (valueItem: MetadataItem): Observable<{ entityExtract?: SafeHtml, actions: Action[] }> | undefined => {
        const hasActions = this.actions || this.filterable || this.excludable;

        if (!hasActions && !this.metadataValue.fnEntityTooltip) return undefined;

        const actions: Action[] = [];
        if (hasActions) {
            if (this.actions) {
                // Inject the hovered value into custom actions
                this.actions.forEach(a => a.data = valueItem);
                actions.push(...this.actions);
            }

            const filterAction = new Action({
                icon: "fas fa-filter",
                text: "msg#metadata.actions.filter",
                action: () => {
                    this.filterItem(valueItem);
                    updateVisibility(valueItem);
                }
            });

            const excludeAction = new Action({
                icon: "fas fa-minus-circle",
                text: "msg#metadata.actions.exclude",
                action: () => {
                    this.filterItem(valueItem, false, true);
                    updateVisibility(valueItem);
                }
            });

            const removeFilterAction = new Action({
                icon: "fas fa-times",
                text: "msg#metadata.actions.removeFilter",
                action: () => {
                    this.filterItem(valueItem, true);
                    updateVisibility(valueItem);
                }
            });

            actions.push(filterAction, excludeAction, removeFilterAction);

            const updateVisibility = (item: MetadataItem) => {
                // Search for an existing filter on the current value and display actions accordingly
                const filter = this.query.findFilter(f => isValueFilter(f) && f.field === this.field && f.value === item.value);
                item.filtered = filter && filter.operator !== 'neq';
                item.excluded = filter && filter.operator === 'neq';
                filterAction.hidden = !this.filterable || !!filter;
                removeFilterAction.hidden = (!this.filterable && !this.excludable) || !filter;
                excludeAction.hidden = !this.excludable || !!filter;
            }

            updateVisibility(valueItem);
        }

        if (!this.metadataValue.fnEntityTooltip) {
            return of({ actions })
        } else {
            return this.metadataValue.fnEntityTooltip({ entity: valueItem as EntityItem, record: this.record, query: this.query! })
                .pipe(map((value: SafeHtml | undefined) => ({ entityExtract: value, actions })));
        }
    }

    private updateCollapsed(): void {
        if (this.valuesEl) { // Display or not the collapse icon
            this.needsCollapse = this.collapseRows && (!this.collapsed || this.valuesEl.nativeElement.scrollHeight > this.valuesEl.nativeElement.clientHeight);
        }
    }

    private regroupEmotions(): void {
      if (this.metadataValue.valueItems.length > 0) {
        this.finalValue = String(this.metadataValue.valueItems[0]["value"]);
      //   switch(firstItem) { 
      //     case 'Admiration':
      //     case "Amusement":
      //     case "Approval":
      //     case "Desire": 
      //     case "Excitement": 
      //     case "Gratitude": 
      //     case "Joy": 
      //     case "Love": 
      //     case "Optimism": 
      //     case "Pride": 
      //     case "Realization": 
      //     case "Relief" : { 
      //        this.finalValue = "&#128053;";
      //        break; 
      //     } 
      //     case "Fear":
      //     case "Anger":
      //     case "Annoyance":
      //     case "Disappointment":
      //     case "Disapproval":
      //     case "Disgust":
      //     case "Embarrassment":
      //     case "Grief":
      //     case "Nervousness":
      //     case "Remorse":
      //     case "Sadness":{ 
      //       this.finalValue = firstItem;
      //        break; 
      //     }
      //     case "Confusion":
      //     case "Curiosity":
      //     case "Surprise":{
      //       this.finalValue = firstItem;
      //       break;
      //     }
      //     case "Caring":{
      //       this.finalValue = firstItem;
      //       break;
      //     }
      //     case "Neutral":{
      //       this.finalValue = firstItem;
      //       break;
      //     }
      //     default: { 
      //        break; 
      //     } 
      //  }     
    }
  }
  
}
