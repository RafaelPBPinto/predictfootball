import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroMoon, heroSun })],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle {
  readonly themeService = inject(ThemeService)

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
