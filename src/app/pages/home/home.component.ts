import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Master Your Skills</h1>
        <p class="hero-subtitle">Practice with AI-Generated MCQ Questions</p>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-container">
          <input
            [(ngModel)]="topic"
            (keyup.enter)="startQuiz()"
            type="text"
            class="search-input"
            placeholder="Enter a topic (e.g., Angular, React, Python)"
            [disabled]="isLoading"
          />
          <button
            (click)="startQuiz()"
            [disabled]="!topic || isLoading"
            class="search-button"
            mat-raised-button
            color="primary"
          >
            <span *ngIf="!isLoading">Start Quiz</span>
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          </button>
        </div>
      </div>

      <!-- Popular Topics -->
      <div class="popular-section">
        <h2>Popular Topics</h2>
        <div class="topics-grid">
          <div
            *ngFor="let t of popularTopics"
            class="topic-card"
            (click)="startQuizWithTopic(t.name)"
          >
            <div class="topic-icon">{{ t.icon }}</div>
            <h3>{{ t.name }}</h3>
            <p class="difficulty">{{ t.difficulty }}</p>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <h2>Why Choose Us?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>AI-Generated</h3>
            <p>Unique questions generated on-the-fly for unlimited practice</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎓</div>
            <h3>Smart Learning</h3>
            <p>Learn from detailed explanations after each question</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Monitor your improvement across different topics</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px 60px;
    }

    .hero-section {
      text-align: center;
      padding: 80px 24px;
      background: linear-gradient(135deg, #6557ee 0%, #4328d6 100%);
      border-radius: 32px;
      color: white;
      box-shadow: 0 28px 80px rgba(67, 40, 214, 0.18);
      margin-bottom: 48px;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4.2rem);
      line-height: 1.03;
      font-weight: 800;
      margin: 0 0 18px;
      letter-spacing: -0.05em;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      opacity: 0.92;
      margin: 0 auto;
      max-width: 680px;
      line-height: 1.7;
    }

    .search-section {
      display: flex;
      justify-content: center;
      margin-top: -32px;
      margin-bottom: 70px;
      z-index: 1;
      position: relative;
    }

    .search-container {
      width: 100%;
      max-width: 760px;
      display: flex;
      gap: 12px;
      background: #ffffff;
      border-radius: 999px;
      padding: 12px;
      box-shadow: 0 25px 60px rgba(102, 126, 234, 0.18);
      align-items: center;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      padding: 18px 22px;
      background: transparent;
      color: #111827;
      min-width: 0;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }

    .search-button {
      min-width: 150px;
      height: 52px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.02em;
      box-shadow: 0 18px 35px rgba(102, 126, 234, 0.2);
    }

    .popular-section {
      margin-bottom: 72px;
    }

    .popular-section h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 28px;
      color: #111827;
      text-align: center;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .topic-card {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 28px;
      padding: 28px 24px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
      box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
      border: 1px solid rgba(226, 232, 240, 0.9);
    }

    .topic-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.14);
      border-color: rgba(102, 126, 234, 0.28);
    }

    .topic-icon {
      width: 72px;
      height: 72px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      font-size: 32px;
      border-radius: 22px;
      background: rgba(99, 102, 241, 0.15);
      color: #4338ca;
    }

    .topic-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0 0 8px;
      color: #111827;
    }

    .difficulty {
      color: #6b7280;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .features-section {
      background: white;
      padding: 64px 40px;
      border-radius: 32px;
      box-shadow: 0 26px 70px rgba(15, 23, 42, 0.08);
      margin-bottom: 24px;
    }

    .features-section h2 {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin: 0 0 44px;
      color: #111827;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 28px;
    }

    .feature-card {
      text-align: center;
      padding: 22px;
      border-radius: 28px;
      border: 1px solid rgba(226, 232, 240, 0.9);
      background: #f8fafc;
      min-height: 240px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 16px;
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 28px;
      border-radius: 18px;
      background: rgba(99, 102, 241, 0.15);
      color: #4338ca;
    }

    .feature-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      color: #111827;
    }

    .feature-card p {
      color: #4b5563;
      line-height: 1.75;
      margin: 0;
    }

    @media (max-width: 840px) {
      .home-container {
        padding: 20px 16px 48px;
      }

      .hero-section {
        padding: 64px 20px;
        margin-bottom: 40px;
      }

      .search-section {
        margin-bottom: 56px;
      }
    }

    @media (max-width: 640px) {
      .search-container {
        flex-direction: column;
      }

      .search-button {
        width: 100%;
      }

      .features-section {
        padding: 48px 20px;
      }
    }
  `]
})
export class HomeComponent {
  topic = '';
  isLoading = false;

  popularTopics = [
    { name: 'Angular', icon: '⚡', difficulty: 'All Levels' },
    { name: 'React', icon: '⚛️', difficulty: 'All Levels' },
    { name: 'Python', icon: '🐍', difficulty: 'All Levels' },
    { name: 'JavaScript', icon: '🟨', difficulty: 'All Levels' },
    { name: 'TypeScript', icon: '🔷', difficulty: 'All Levels' },
    { name: 'Machine Learning', icon: '🧠', difficulty: 'All Levels' }
  ];

  constructor(private router: Router) {}

  startQuiz() {
    if (this.topic.trim()) {
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigate(['/quiz', this.topic]);
        this.isLoading = false;
      }, 500);
    }
  }

  startQuizWithTopic(topicName: string) {
    this.topic = topicName;
    this.startQuiz();
  }
}
