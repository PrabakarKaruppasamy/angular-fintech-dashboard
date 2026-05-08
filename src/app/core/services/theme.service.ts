import { Injectable, signal, effect } from '@angular/core';
import { Theme } from '../models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<Theme>(this.getSavedTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const t = this._theme();
      document.body.className = t === 'dark' ? 'dark-theme' : 'light-theme';
      localStorage.setItem('fintech_theme', t);
    });
  }

  toggle(): void {
    this._theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  isDark(): boolean { return this._theme() === 'dark'; }

  private getSavedTheme(): Theme {
    const saved = localStorage.getItem('fintech_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
