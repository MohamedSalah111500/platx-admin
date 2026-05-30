import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { environment } from "../environments/environment";

// Swiper Slider
// bootstrap component
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { ToastrModule } from "ngx-toastr";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

// Store
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
// Page Route
import { ExtrapagesModule } from "./extrapages/extrapages.module";
import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// Auth
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { rootReducer } from "./store";
import { CartEffects } from "./store/Cart/cart.effects";
import { ProjectEffects } from "./store/ProjectsData/project.effects";
import { usersEffects } from "./store/UserGrid/user.effects";
import { userslistEffects } from "./store/UserList/userlist.effect";
import { CandidateEffects } from "./store/Candidate/candidate.effects";
import { tasklistEffects } from "./store/Tasks/tasks.effect";
import { AuthInterceptor } from "./core/helpers/auth.interceptor";
import { ApiEnvInterceptor } from "./core/helpers/api-env.interceptor";
import { UIModule } from "./shared/ui/ui.module";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LayoutsModule,
    AppRoutingModule,
    UIModule,
    ExtrapagesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ScrollToModule.forRoot(),
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      CartEffects,
      ProjectEffects,
      usersEffects,
      userslistEffects,
      CandidateEffects,
      tasklistEffects,
    ]),
  ],
  bootstrap: [AppComponent],
  providers: [
    // ApiEnvInterceptor rewrites the URL first, then AuthInterceptor attaches the token.
    { provide: HTTP_INTERCEPTORS, useClass: ApiEnvInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AppModule {}
