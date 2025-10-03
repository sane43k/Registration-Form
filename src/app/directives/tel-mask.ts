import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTelMask]',
})
export class TelMask {
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = this.formatValue(input.value);
  }

  getDigitsOnly(value: string): string {
    return value.replace(/\D/g, '');
  }

  formatValue(value: string): string {
    let digits = this.getDigitsOnly(value);
    let formatted = '';

    if (digits.startsWith('375')) {
      digits = digits.substring(0, 12);

      formatted = '+375';
      const code = digits.substring(3, 5);
      const part1 = digits.substring(5, 8);
      const part2 = digits.substring(8, 10);
      const part3 = digits.substring(10, 12);

      if (code) formatted += ` (${code}`;
      if (part1) formatted += `) ${part1}`;
      if (part2) formatted += `-${part2}`;
      if (part3) formatted += `-${part3}`;
    } else {
      digits = digits.substring(0, 17);

      if (digits) {
        formatted = `+${digits}`;
      }
    }

    return formatted;
  }
}
