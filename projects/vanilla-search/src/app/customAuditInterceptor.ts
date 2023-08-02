import { Injectable, Inject } from '@angular/core';
import { AuditInterceptor } from '@sinequa/core/app-utils';
import { AuditRecord, StartConfig, START_CONFIG } from '@sinequa/core/web-services';
import { SearchService } from '@sinequa/components/search';
import { LoginService } from '@sinequa/core/login';
 
@Injectable({
    providedIn: "root"
})
export class CustomAuditInterceptor extends AuditInterceptor {
 
    constructor(
        @Inject(START_CONFIG) startConfig: StartConfig,
        public searchService: SearchService,
        public loginService: LoginService)
        {
        super(startConfig);
    }
 
    protected override updateAuditRecord(auditRecord?: AuditRecord) {
        auditRecord?.auditEvents?.forEach(event => {
                const country = this.loginService.principal?.param6;
                const department = this.loginService.principal?.param4;
                const city = this.loginService.principal?.param5;
                if (event.detail != null) {
                    event.detail.country = country;
                    event.detail.department = department;
                    event.detail.city = city;
                }
        });
    }
}