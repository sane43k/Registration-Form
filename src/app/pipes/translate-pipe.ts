import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation-service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string, params?: Record<string, any>) {
    return this.translationService.translate(key, params);
  }
}
