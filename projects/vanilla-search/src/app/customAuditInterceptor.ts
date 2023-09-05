import { Injectable, Inject } from '@angular/core';
import { AuditInterceptor } from '@sinequa/core/app-utils';
import { AuditRecord, StartConfig, START_CONFIG } from '@sinequa/core/web-services';
import { SearchService } from '@sinequa/components/search';
import { LoginService } from '@sinequa/core/login';
import { UserPreferences } from '@sinequa/components/user-settings';

@Injectable({
    providedIn: "root"
})
export class CustomAuditInterceptor extends AuditInterceptor {
 
    constructor(
        @Inject(START_CONFIG) startConfig: StartConfig,
        public searchService: SearchService,
        public loginService: LoginService,
        public prefs: UserPreferences)
        {
        super(startConfig);
    }
 
    protected override updateAuditRecord(auditRecord?: AuditRecord) {
        auditRecord?.auditEvents?.forEach(event => {
                const country = this.prefs.get("user-country");
                if (event.detail != null) {
                    event.detail.country = country;
                }
        });
    }
}