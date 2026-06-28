import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  readonly demoCredentials = [
    { role: 'Admin', email: 'admin@fintech.com', password: 'admin123', color: '#1b3a6b' },
    { role: 'Viewer', email: 'viewer@fintech.com', password: 'viewer123', color: '#1a6b5a' }
  ];

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  fillDemo(email: string, password: string): void {
    this.loginForm.patchValue({ email, password });
    this.error.set(null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  get emailCtrl() { return this.loginForm.get('email')!; }
  get passwordCtrl() { return this.loginForm.get('password')!; }
}
