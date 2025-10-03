import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegFormCva } from './components/reg-form-cva/reg-form-cva';
import { RegFormCc } from './components/reg-form-cc/reg-form-cc';
import { LanguageControl } from './components/language-control/language-control';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegFormCva, RegFormCc, LanguageControl],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
