import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void {
    const body = document.body;
    body.setAttribute("data-bs-theme", "light");
    body.setAttribute("data-sidebar", "dark");
    body.setAttribute("data-layout-size", "fluid");
    body.removeAttribute("data-topbar");
  }
}
