import { Injectable } from '@angular/core';
 
import { SearchService } from '@sinequa/components/search';
 
import { ReplaySubject } from 'rxjs';
import { Results } from '@sinequa/core/web-services';
 
@Injectable({
  providedIn: 'root'
})
export class QueryIntentService {
 
  constructor(
    public searchService: SearchService
  ) {
    this.init();
   }
 
   init() {
    this.searchService.events.subscribe(_event => {
        if(_event.type === 'new-query-intents') {
            this.processCustomers(_event);
        }
    });
}
 
 // People Query intent data
 journalist?: string;
 journalistData = new ReplaySubject<Results>(1);
 
 processCustomers(_event: SearchService.NewQueryIntentsEvent) {
     // Look for the "customers" intent
    let journalists;    
    if(_event.intents.find(intent => intent.name === "PlatformQueryIntent")){
      journalists = _event.intents.filter(intent => intent.name === "PlatformQueryIntent")
        .map(intent => intent.globalEntities?.find(entity => entity.resource === 'person')?.normalization as string)
        .filter(f => !!f);
        console.log("***journalist based on rules", journalists)
    }
       
 
     // If any (and if not already processed)
     if(journalists.length > 0 && this.journalist !== journalists[0]) {
         // Create a query for this person
         const query = this.searchService.makeQuery();
         query.text = journalists[0];
         query.action = "aggregate";
         query.aggregations = ["Platform"];

          this.searchService.getResults(query)
            .subscribe(r => {
            this.journalist = journalists[0] + " Tested on the following platforms";
            this.journalistData.next(r);
             });
     }
 
     // If none, we want to stop displaying the infocard, if any
     else if(journalists.length === 0) {
         this.journalist = undefined;
         this.journalistData.next(journalists);
     }
 
 }
}
