import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from "@angular/core";
import { TabComponent } from "@poll-base/shared/components/my-tab-view/tab/tab.component";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    let activeTabs: TabComponent[] = this.tabs.filter((tab: TabComponent) => tab.active);
    if (activeTabs.length == 0) {
      this.selectTab(this.tabs.first);
    } else {
      // @ts-ignore
      this.selectTab(activeTabs.at(0));
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((tab: TabComponent): boolean => (tab.active = false));
    tab.active = true;
  }
}
