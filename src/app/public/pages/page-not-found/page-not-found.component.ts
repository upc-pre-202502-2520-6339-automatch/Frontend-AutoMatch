// page-not-found.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DisplayService} from "../service/display.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  constructor(private displayService: DisplayService) {}

  ngOnInit(): void {
    this.displayService.toggleHeaderFooter(false);
  }

  ngOnDestroy(): void {
    this.displayService.toggleHeaderFooter(true);
  }

  goBack() {
    window.history.back();
  }
}