import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  username = signal('');
  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  pending = signal(false);

  async onSubmit() {
    this.error.set(null);
    this.pending.set(true);
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth
          .register({ username: this.username(), email: this.email(), password: this.password() })
          .subscribe({
            next: () => resolve(),
            error: (err) => reject(err),
          });
      });
      this.router.navigate(['/']);
    } catch (err) {
      const message = (err as { error?: { message?: string } })?.error?.message;
      this.error.set(message ?? this.i18n.t('auth.error.generic'));
    } finally {
      this.pending.set(false);
    }
  }
}
