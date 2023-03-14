import { CommentsWebService } from "@sinequa/components/comments";
import { AppWebService, AuditWebService, PreviewWebService, PrincipalWebService, QueryWebService, SimilarDocumentsWebService, StartConfigWebService, UserSettingsWebService } from "@sinequa/core/web-services";
import { MockAppWebService } from "../mocks/services/app.web.service";
import { MockAuditWebService } from "../mocks/services/audit.web.service";
import { MockCommentsWebService } from "../mocks/services/comments.web.service";
import { MockPreviewWebService } from "../mocks/services/preview.web.service";
import { MockPrincipalWebService } from "../mocks/services/principal.web.service";
import { MockQueryWebService } from "../mocks/services/query.web.service";
import { MockSimilarDocumentsWebService } from "../mocks/services/similar-documents.web.service";
import { MockStartConfigWebService } from "../mocks/services/start-config.web.service";
import { MockUserSettingsWebService } from "../mocks/services/user-settings.web.service";

export const environment = {
  url: "https://localhost:4200",
  autoSAMLProvider: "identity-dev",
  production: false,
  mock: true,
  providers: [
    { provide: AppWebService, useClass: MockAppWebService },
    { provide: QueryWebService, useClass: MockQueryWebService },
    { provide: StartConfigWebService, useClass: MockStartConfigWebService },
    { provide: CommentsWebService, useClass: MockCommentsWebService },
    { provide: PreviewWebService, useClass: MockPreviewWebService },
    { provide: SimilarDocumentsWebService, useClass: MockSimilarDocumentsWebService },
    { provide: UserSettingsWebService, useClass: MockUserSettingsWebService },
    { provide: PrincipalWebService, useClass: MockPrincipalWebService },
    { provide: AuditWebService, useClass: MockAuditWebService },
  ]
};