import { Component, computed } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { filter, map, startWith } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SeoService, RouteSeoData } from './services/seo.service';

function getDeepestRoute(router: Router) {
  let route = router.routerState.snapshot.root;
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
}

function isChromeHidden(router: Router): boolean {
  return !!getDeepestRoute(router).data['hideChrome'];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showNavbar;

  constructor(
    private router: Router,
    seo: SeoService,
    scroller: ViewportScroller,
  ) {
    scroller.setOffset([0, 80]);

    const hideChrome = toSignal(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => isChromeHidden(this.router)),
      ),
      { initialValue: isChromeHidden(this.router) },
    );
    this.showNavbar = computed(() => !hideChrome());

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => getDeepestRoute(this.router).data['seo'] as RouteSeoData | undefined),
        startWith(getDeepestRoute(this.router).data['seo'] as RouteSeoData | undefined),
      )
      .subscribe(seoData => {
        if (seoData) {
          seo.update(seoData, this.router.url);
        }
      });
  }
}
