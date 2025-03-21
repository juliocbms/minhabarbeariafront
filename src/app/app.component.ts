import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { SideBarComponent } from "./commons/components/side-bar/side-bar.component";
import { MainContentComponent } from "./commons/components/main-content/main-content.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent, MainContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'barbeariafront';

  private routeSubscription?: Subscription

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute){

  }


  ngOnDestroy(): void {
    if (this.routeSubscription){
      this.routeSubscription.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getRouteTitle(this.activatedRoute))
    ).subscribe(title=> this.title = title)}



  private getRouteTitle(route: ActivatedRoute): string{
    let child = route;
    while(child.firstChild){
      child = child.firstChild;
    }
    return child.snapshot.data['title'] || 'Default Title';
  }
}


