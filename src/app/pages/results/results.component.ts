import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

interface QuizResults {
  topic: string;
  score: number;
  total: number;
  percentage: number;
  answers: { [key: number]: string };
  questions: any[];
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="results-container">
      <div *ngIf="results" class="results-content">
        <!-- Score Card -->
        <mat-card class="score-card" [ngClass]="'score-' + getGrade(results.percentage)">
          <div class="score-circle">
            <div class="percentage">{{ results.percentage }}%</div>
            <div class="score-text">{{ results.score }}/{{ results.total }}</div>
          </div>
          <div class="score-info">
            <h2>{{ getTitleByGrade(getGrade(results.percentage)) }}</h2>
            <p class="topic-name">{{ results.topic }}</p>
            <p class="feedback">{{ getFeedback(results.percentage) }}</p>
          </div>
        </mat-card>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <p class="stat-label">Correct</p>
              <p class="stat-value">{{ results.score }}</p>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>cancel</mat-icon>
            <div>
              <p class="stat-label">Incorrect</p>
              <p class="stat-value">{{ results.total - results.score }}</p>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>quiz</mat-icon>
            <div>
              <p class="stat-label">Total Questions</p>
              <p class="stat-value">{{ results.total }}</p>
            </div>
          </div>
        </div>

        <!-- Review Section -->
        <mat-card class="review-card">
          <h3>Review Your Answers</h3>
          <div class="answers-list">
            <div
              *ngFor="let question of results.questions"
              class="answer-item"
              [ngClass]="{ 'correct': results.answers[question.id] === question.correct_answer, 'incorrect': results.answers[question.id] !== question.correct_answer }"
            >
              <div class="answer-header">
                <div class="answer-status">
                  <mat-icon *ngIf="results.answers[question.id] === question.correct_answer" class="icon-correct">check_circle</mat-icon>
                  <mat-icon *ngIf="results.answers[question.id] !== question.correct_answer" class="icon-incorrect">cancel</mat-icon>
                </div>
                <h4>{{ question.question }}</h4>
              </div>
              <div class="answer-details">
                <p><strong>Your Answer:</strong> {{ results.answers[question.id] || 'Not answered' }}</p>
                <p *ngIf="results.answers[question.id] !== question.correct_answer">
                  <strong>Correct Answer:</strong> {{ question.correct_answer }}
                </p>
                <p class="explanation"><strong>Explanation:</strong> {{ question.explanation }}</p>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-stroked-button (click)="goHome()" class="action-button">
            <mat-icon>home</mat-icon>
            Home
          </button>
          <button mat-raised-button color="primary" (click)="retakeQuiz()" class="action-button">
            <mat-icon>refresh</mat-icon>
            Retake Quiz
          </button>
        </div>
      </div>

      <div *ngIf="!results" class="no-results">
        <mat-card>
          <p>No quiz results found. Please complete a quiz first.</p>
          <button mat-raised-button color="primary" (click)="goHome()">Start Quiz</button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
      min-height: calc(100vh - 64px);
    }

    .results-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .score-card {
      display: flex;
      align-items: center;
      gap: 40px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      border-radius: 12px;
    }

    .score-card.score-a {
      background: linear-gradient(135deg, #00b894 0%, #00a876 100%);
    }

    .score-card.score-b {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .score-card.score-c {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }

    .score-card.score-d {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }

    .score-circle {
      min-width: 140px;
      width: 140px;
      height: 140px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.5);
    }

    .percentage {
      font-size: 40px;
      font-weight: 700;
    }

    .score-text {
      font-size: 16px;
      font-weight: 600;
      opacity: 0.9;
    }

    .score-info {
      flex: 1;
      text-align: left;
    }

    .score-info h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 700;
    }

    .topic-name {
      margin: 0 0 8px 0;
      font-size: 16px;
      opacity: 0.95;
    }

    .feedback {
      margin: 0;
      font-size: 14px;
      opacity: 0.85;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .review-card {
      padding: 32px;
    }

    .review-card h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 24px 0;
      color: #333;
    }

    .answers-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .answer-item {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.3s;
    }

    .answer-item.correct {
      border-color: #4caf50;
      background-color: #f1f8f5;
    }

    .answer-item.incorrect {
      border-color: #f44336;
      background-color: #fff5f5;
    }

    .answer-header {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .answer-status {
      min-width: 24px;
      display: flex;
      align-items: center;
    }

    .icon-correct {
      color: #4caf50;
    }

    .icon-incorrect {
      color: #f44336;
    }

    .answer-header h4 {
      margin: 0;
      font-size: 16px;
      color: #333;
      flex: 1;
    }

    .answer-details {
      margin-left: 36px;
      font-size: 14px;
      line-height: 1.6;
    }

    .answer-details p {
      margin: 8px 0;
      color: #555;
    }

    .explanation {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 8px;
      border-radius: 4px;
      margin-top: 12px !important;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-wrap: wrap;
    }

    .action-button {
      min-width: 150px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .no-results mat-card {
      text-align: center;
      padding: 40px;
    }

    @media (max-width: 768px) {
      .score-card {
        flex-direction: column;
        text-align: center;
      }

      .score-info {
        text-align: center;
      }

      .answer-header {
        flex-direction: column;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  results: QuizResults | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const resultsStr = sessionStorage.getItem('quizResults');
    if (resultsStr) {
      this.results = JSON.parse(resultsStr);
    }
  }

  getGrade(percentage: number): string {
    if (percentage >= 90) return 'a';
    if (percentage >= 80) return 'b';
    if (percentage >= 70) return 'c';
    return 'd';
  }

  getTitleByGrade(grade: string): string {
    const titles: { [key: string]: string } = {
      a: 'Excellent!',
      b: 'Very Good!',
      c: 'Good',
      d: 'Keep Practicing'
    };
    return titles[grade] || 'Complete!';
  }

  getFeedback(percentage: number): string {
    if (percentage >= 90) return 'Outstanding performance! You have mastered this topic.';
    if (percentage >= 80) return 'Great job! You have a strong understanding of this topic.';
    if (percentage >= 70) return 'Good effort! Review the incorrect answers to improve further.';
    return 'Keep practicing! This topic needs more focus.';
  }

  goHome() {
    sessionStorage.removeItem('quizResults');
    this.router.navigate(['/']);
  }

  retakeQuiz() {
    if (this.results) {
      sessionStorage.removeItem('quizResults');
      this.router.navigate(['/quiz', this.results.topic]);
    }
  }
}
