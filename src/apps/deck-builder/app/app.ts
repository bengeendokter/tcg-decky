import { Component, inject, PLATFORM_ID, type OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  setTheme,
  enableSystemContrastPreferenceListener,
  enableSystemColorSchemePreferenceListener,
} from "#style/util/theme.ts";
import { isPlatformBrowser } from "@angular/common";
import { OverviewPage } from "#deck-builder/feature/overview-page/overview-page.ts";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, OverviewPage],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // set theming
      setTheme();
      enableSystemContrastPreferenceListener();
      enableSystemColorSchemePreferenceListener();
    }
  }
}
