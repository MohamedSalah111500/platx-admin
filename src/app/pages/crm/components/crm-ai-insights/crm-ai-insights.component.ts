import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { CrmService } from "../../services/crm.service";
import { CRM_AI_ROLE, CrmAiMessage } from "../../types";

interface CrmAiChatEntry extends CrmAiMessage {
  leadsAnalyzed?: number;
  totalLeads?: number;
}

const MAX_QUESTION_LENGTH = 1000;
const HISTORY_LIMIT = 10;
const SUGGESTION_KEYS = [
  "CRM.AI.SUGGESTIONS.NOT_CONVERTING",
  "CRM.AI.SUGGESTIONS.COMPLAINTS",
  "CRM.AI.SUGGESTIONS.MEETING_NO_SHOW",
  "CRM.AI.SUGGESTIONS.BEST_SOURCE",
  "CRM.AI.SUGGESTIONS.STUCK_LEADS",
  "CRM.AI.SUGGESTIONS.TEAM_PERFORMANCE",
];

@Component({
  selector: "app-crm-ai-insights",
  templateUrl: "./crm-ai-insights.component.html",
  styleUrls: ["./crm-ai-insights.component.scss"],
})
export class CrmAiInsightsComponent implements OnDestroy {
  @ViewChild("conversation") private conversation?: ElementRef<HTMLElement>;

  readonly CRM_AI_ROLE = CRM_AI_ROLE;
  readonly suggestionKeys = SUGGESTION_KEYS;
  readonly maxQuestionLength = MAX_QUESTION_LENGTH;
  readonly breadCrumbItems = [{ label: "MENUITEMS.CRM.TEXT" }, { label: "CRM.AI.PAGE_TITLE", active: true }];

  messages: CrmAiChatEntry[] = [];
  question = "";
  loading = false;
  error = "";
  private request?: Subscription;

  constructor(private crmService: CrmService, private translate: TranslateService) {}

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  askSuggestion(key: string): void {
    this.ask(this.translate.instant(key));
  }

  submit(): void {
    this.ask(this.question);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    }
  }

  clear(): void {
    this.request?.unsubscribe();
    this.messages = [];
    this.error = "";
    this.loading = false;
  }

  private ask(text: string): void {
    const question = text.trim();
    if (!question || this.loading) return;

    const history: CrmAiMessage[] = this.messages
      .slice(-HISTORY_LIMIT)
      .map(({ role, content }) => ({ role, content }));

    this.messages = [...this.messages, { role: CRM_AI_ROLE.User, content: question }];
    this.question = "";
    this.error = "";
    this.loading = true;
    this.scrollToBottom();

    this.request = this.crmService.askAiInsights({ question, history }).subscribe({
      next: (res) => {
        this.messages = [
          ...this.messages,
          {
            role: CRM_AI_ROLE.Assistant,
            content: res.answer,
            leadsAnalyzed: res.leadsAnalyzed,
            totalLeads: res.totalLeads,
          },
        ];
        this.loading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? this.translate.instant("CRM.AI.ERROR");
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.conversation?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
