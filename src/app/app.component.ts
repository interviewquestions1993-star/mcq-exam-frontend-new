import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule],
  template: `
    <header class="app-header">
      <div class="toolbar-container">
        <a class="logo" routerLink="/">🎓 MCQ Exam & Interview Preparer</a>
        <nav class="main-nav">
          <a routerLink="/about" class="nav-link about-link">
            <mat-icon>info</mat-icon>
            About
          </a>
          <a routerLink="/contact" class="nav-link contact-link">
            <mat-icon>contact_mail</mat-icon>
            Contact
          </a>
        </nav>
      </div>
    </header>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a routerLink="/about">
            <mat-icon>info</mat-icon>
            About
          </a>
          <a routerLink="/contact">
            <mat-icon>contact_mail</mat-icon>
            Contact
          </a>
          <a routerLink="/privacy-policy">
            <mat-icon>privacy_tip</mat-icon>
            Privacy Policy
          </a>
          <a routerLink="/terms-of-service">
            <mat-icon>gavel</mat-icon>
            Terms of Service
          </a>
        </div>
        <div class="footer-copyright">
          <p>&copy; 2026 MCQ Exam & Interview Preparer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-Q3VBZ7SE3S', {
          page_path: event.urlAfterRedirects
        });
      });
  }
}
