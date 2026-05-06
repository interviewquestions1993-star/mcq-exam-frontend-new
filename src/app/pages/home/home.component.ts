import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
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
            <mat-icon class="topic-icon">{{ t.icon }}</mat-icon>
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
            <mat-icon class="feature-icon">flash_on</mat-icon>
            <h3>AI-Generated</h3>
            <p>Unique questions generated on-the-fly for unlimited practice</p>
          </div>
          <div class="feature-card">
            <mat-icon class="feature-icon">school</mat-icon>
            <h3>Smart Learning</h3>
            <p>Learn from detailed explanations after each question</p>
          </div>
          <div class="feature-card">
            <mat-icon class="feature-icon">trending_up</mat-icon>
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
      padding: 40px 20px;
    }

    .hero-section {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      color: white;
      margin-bottom: 40px;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 15px 0;
    }

    .hero-subtitle {
      font-size: 20px;
      opacity: 0.95;
      margin: 0;
    }

    .search-section {
      display: flex;
      justify-content: center;
      margin-bottom: 60px;
    }

    .search-container {
      display: flex;
      gap: 10px;
      width: 100%;
      max-width: 600px;
    }

    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      border-color: #667eea;
    }

    .search-input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .search-button {
      padding: 0 32px;
      min-width: 140px;
    }

    .popular-section {
      margin-bottom: 80px;
    }

    .popular-section h2 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 30px 0;
      color: #333;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .topic-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 2px solid transparent;
    }

    .topic-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .topic-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #667eea;
      margin-bottom: 12px;
    }

    .topic-card h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 12px 0 8px 0;
      color: #333;
    }

    .difficulty {
      color: #999;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .features-section {
      background: white;
      padding: 60px 40px;
      border-radius: 8px;
      margin-bottom: 40px;
    }

    .features-section h2 {
      font-size: 28px;
      font-weight: 600;
      text-align: center;
      margin: 0 0 40px 0;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .feature-card {
      text-align: center;
    }

    .feature-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: #333;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 20px;
      }

      .hero-title {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }

      .search-container {
        flex-direction: column;
      }

      .search-button {
        width: 100%;
      }

      .features-section {
        padding: 30px 20px;
      }
    }
  `]
})
export class HomeComponent {
  topic = '';
  isLoading = false;

  popularTopics = [
    { name: 'Angular', icon: 'code', difficulty: 'All Levels' },
    { name: 'React', icon: 'code', difficulty: 'All Levels' },
    { name: 'Python', icon: 'terminal', difficulty: 'All Levels' },
    { name: 'JavaScript', icon: 'code', difficulty: 'All Levels' },
    { name: 'TypeScript', icon: 'code', difficulty: 'All Levels' },
    { name: 'Machine Learning', icon: 'psychology', difficulty: 'All Levels' }
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
