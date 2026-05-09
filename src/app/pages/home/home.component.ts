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
  styleUrls: ['./home.component.css']
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



