import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation-service';

@Component({
  selector: 'app-language-control',
  imports: [],
  templateUrl: './language-control.html',
  styleUrl: './language-control.scss',
})
export class LanguageControl {
  private translationService = inject(TranslationService);

  setLang(lang: string): void {
    this.translationService.setLanguage(lang);
  }
}
