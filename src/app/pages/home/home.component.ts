import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="hero-title">Master Your Skills</h1>
        <p class="hero-subtitle">Practice with AI-Generated Questions for Exams & Interviews</p>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-container">
          <input
            [(ngModel)]="topic"
            (keyup.enter)="startQuiz()"
            type="text"
            class="search-input"
            placeholder="🎯 Enter any topic you're curious about! (e.g., AI, Data Science, CBSE Class 10 Science, Machine Learning...)"
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

      <!-- Search Example Tips -->
      <div class="search-hint-card">
        <p class="hint-title">Try these search terms</p>
        <div class="hint-chip-row">
          <span class="hint-chip">🔎 React Advanced Interview Questions</span>
          <span class="hint-chip">🔎 Angular Architect Interview Questions</span>
          <span class="hint-chip">🔎 Azure Interview Questions</span>
          <span class="hint-chip">🔎 CBSE Class 10 Science Questions</span>
        </div>
        <p class="hint-note">...and many more topics are supported.</p>
        <p class="hint-help"><mat-icon class="hint-mail-icon">email</mat-icon><a class="hint-mail-link" href="mailto:interviewquestions1993@gmail.com">Send us a mail if you want any new topics added.</a></p>
      </div>

      <!-- Flexibility Section -->
      <div class="flexibility-section">
        <div class="flexibility-content">
          <h2>🎯 Unleash Your Curiosity!</h2>
          <p class="flexibility-text">
            This website is incredibly flexible and perfect for everyone! Whether you're a <strong>software engineer</strong> sharpening your coding skills,
            a <strong>student</strong> preparing for exams, a <strong>government job aspirant</strong> practicing for competitive exams,
            or just a <strong>fun-seeking person</strong> who wants to quiz yourself on anything that sparks your interest -
            from Bollywood movies to ancient history, space exploration to cooking techniques!
          </p>
          <p class="flexibility-highlight">
            🚀 Give any topic you love, and we'll create engaging questions to challenge and entertain you!
          </p>
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
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  topic = '';
  isLoading = false;

  popularTopics = [
    { name: 'CBSE', icon: '📚', difficulty: 'Classes 1-12' },
    { name: 'Angular', icon: '⚡', difficulty: 'All Levels' },
    { name: 'React', icon: '⚛️', difficulty: 'All Levels' },
    { name: 'Python', icon: '🐍', difficulty: 'All Levels' },
    { name: 'JavaScript', icon: '🟨', difficulty: 'All Levels' },
    { name: 'TypeScript', icon: '🔷', difficulty: 'All Levels' },
    { name: 'Machine Learning', icon: '🧠', difficulty: 'All Levels' },
    { name: 'Data Science', icon: '📊', difficulty: 'All Levels' },
    { name: 'Artificial Intelligence', icon: '🤖', difficulty: 'All Levels' }
  ];

  constructor(private router: Router) {}

  startQuiz() {
    if (this.topic.trim()) {
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigate(['/quiz', this.topic.trim()]);
        this.isLoading = false;
      }, 500);
    }
  }

  startQuizWithTopic(topicName: string) {
    if (topicName === 'CBSE') {
      this.router.navigate(['/cbse']);
    } else {
      this.router.navigate(['/topics', topicName]);
    }
  }
}



