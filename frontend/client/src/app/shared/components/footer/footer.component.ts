import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  languages: string[] = ['English', 'Việt Nam'];
  languageValue: string = this.languages[0];
  isOpenMenuLanguage: boolean = false;

  @ViewChild('language') language!: ElementRef;
  @ViewChild('menuLanguage') menuLanguage!: ElementRef;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.language.nativeElement && e.target !== this.menuLanguage.nativeElement) {
        this.isOpenMenuLanguage = false;
      }
    })
  }

  ngOnInit(): void {
  }

  onChangeLanguage(lang: string): void {
    this.languageValue = lang;
  }

  toggleMenuLanguage() {
    this.isOpenMenuLanguage = !this.isOpenMenuLanguage;
  }
}
