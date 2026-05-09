import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <div class="toolbar-container">
        <span class="logo">🎓 MCQ Exam Preparer</span>
      </div>
    </header>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .toolbar-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 20px;
    }

    .logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #111827;
    }

    .main-content {
      min-height: calc(100vh - 72px);
      background: linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
    }
  `]
})
export class AppComponent {}
