import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService implements OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  private translations: Record<string, any> = {};
  private currentLang = new BehaviorSubject<string>('en');

  lang$ = this.currentLang.asObservable();

  constructor() {
    this.loadTranslations('en');
  }

  private loadTranslations(lang: string): void {
    this.http
      .get<Record<string, any>>(`/assets/languages/${lang}.json`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.translations = data));
  }

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
    this.loadTranslations(lang);
  }

  translate(key: string, params?: Record<string, any>): string {
    let result = key.split('.').reduce((obj, k) => obj?.[k], this.translations);

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      Object.keys(params).forEach((param) => {
        const regex = new RegExp(`{{\\s*${param}\\s*}}`, 'g');
        result = result['replace'](regex, params[param]);
      });
    }

    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
