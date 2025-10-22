import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DisplayService } from './public/pages/service/display.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-car2go';
  showToolbar: boolean = true;
  showFooter: boolean = true;

  private noFooterRoutes: string[] = ['/profile'];
  private noHeaderFooterRoutes: string[] = ['/login', '/register', '/forgot-password', '/plan', '/payment-form', '/profile-form'];

  constructor(private router: Router, private displayService: DisplayService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentRoute = event.urlAfterRedirects;

      const hideHeaderFooter = this.noHeaderFooterRoutes.includes(currentRoute);
      const hideFooter = this.noFooterRoutes.includes(currentRoute) || hideHeaderFooter;

      this.showToolbar = !hideHeaderFooter;
      this.showFooter = !hideFooter;
    });

    this.displayService.showHeaderFooter$.subscribe(show => {
      if (this.showToolbar && this.showFooter) {
        this.showToolbar = show;
        this.showFooter = show;
      }
    });
  }
}
