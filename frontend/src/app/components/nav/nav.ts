import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService, Lang } from '../../services/i18n.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  private readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly currentLang = this.i18n.currentLang;
  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly currentUser = this.auth.currentUser;

  setLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
