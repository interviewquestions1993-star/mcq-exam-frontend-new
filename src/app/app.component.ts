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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 24px;
    }

    .toolbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0px 20px;
      height: 72px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 600;
      color: white;
      text-decoration: none;
      cursor: pointer;
    }

    .main-content {
      min-height: calc(100vh - 84px);
      background-color: #f5f7fa;
      padding: 84px 0 24px;
    }
  `]
})
export class AppComponent {}
