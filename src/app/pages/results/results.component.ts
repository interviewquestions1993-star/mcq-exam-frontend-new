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
      <div *ngIf="results; else noResults">
        <div class="summary-card" [ngClass]="'score-' + getGrade(results.percentage)">
          <div class="score-circle">
            <div class="circle-value">{{ results.percentage }}%</div>
            <div class="circle-meta">{{ results.score }}/{{ results.total }}</div>
          </div>
          <div class="summary-details">
            <h2>{{ getTitleByGrade(getGrade(results.percentage)) }}</h2>
            <p class="topic-name">{{ results.topic }}</p>
            <p class="summary-text">{{ getFeedback(results.percentage) }}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div>
              <p class="stat-label">Correct</p>
              <p class="stat-value">{{ results.score }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div>
              <p class="stat-label">Incorrect</p>
              <p class="stat-value">{{ results.total - results.score }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❓</div>
            <div>
              <p class="stat-label">Total Questions</p>
              <p class="stat-value">{{ results.total }}</p>
            </div>
          </div>
        </div>

        <div class="review-card">
          <h3>Review Your Answers</h3>
          <div class="answers-list">
            <div
              *ngFor="let question of results.questions"
              class="answer-item"
              [ngClass]="{ 'correct': results.answers[question.id] === question.correct_answer, 'incorrect': results.answers[question.id] !== question.correct_answer }"
            >
              <div class="answer-header">
                <div class="answer-status">
                  <span class="answer-emoji" *ngIf="results.answers[question.id] === question.correct_answer">✅</span>
                  <span class="answer-emoji" *ngIf="results.answers[question.id] !== question.correct_answer">❌</span>
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
        </div>

        <div class="action-buttons">
          <button mat-stroked-button color="primary" class="action-button home-button" (click)="goHome()">
            🏠 Home
          </button>
          <button mat-raised-button color="primary" class="action-button retake-button" (click)="retakeQuiz()">
            🔄 Retake Quiz
          </button>
        </div>
      </div>

      <ng-template #noResults>
        <div class="no-results">
          <div class="no-results-card">
            <p>No quiz results found. Please complete a quiz first.</p>
            <button mat-raised-button color="primary" class="start-button" (click)="goHome()">Start Quiz</button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
      min-height: calc(100vh - 64px);
    }

    .summary-card {
      display: flex;
      gap: 30px;
      align-items: center;
      justify-content: space-between;
      padding: 36px 40px;
      border-radius: 28px;
      box-shadow: 0 28px 80px rgba(195, 45, 36, 0.18);
      color: white;
      flex-wrap: wrap;
    }

    .summary-card.score-pass {
      background: linear-gradient(135deg, #16a34a 0%, #059669 100%);
      box-shadow: 0 28px 80px rgba(22, 163, 74, 0.18);
    }

    .summary-card.score-fail {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 28px 80px rgba(239, 68, 68, 0.18);
    }

    .score-circle {
      width: 200px;
      height: 200px;
      min-width: 200px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }

    .circle-value {
      font-size: 4.8rem;
      font-weight: 800;
      line-height: 1;
      color: white;
      font-family: 'Inter', sans-serif;
    }

    .circle-meta {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }

    .summary-details {
      flex: 1;
      min-width: 240px;
    }

    .summary-details h2 {
      margin: 0 0 12px;
      font-size: 3rem;
      font-weight: 800;
      color: white;
      font-family: 'Inter', sans-serif;
      line-height: 1;
    }

    .topic-name {
      margin: 0 0 10px;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }

    .summary-text {
      margin: 0;
      color: rgba(255, 255, 255, 0.92);
      font-size: 1rem;
      line-height: 1.8;
      font-family: 'Inter', sans-serif;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      font-size: 1.4rem;
      background: #eef2ff;
      border-radius: 12px;
    }

    .stat-label {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: 'Inter', sans-serif;
    }

    .stat-value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      font-family: 'Inter', sans-serif;
    }

    .review-card {
      padding: 32px;
      border-radius: 20px;
      background: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .review-card h3 {
      margin: 0 0 24px;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      font-family: 'Inter', sans-serif;
    }

    .answers-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .answer-item {
      padding: 22px;
      border-radius: 20px;
      border: 1px solid rgba(226, 232, 240, 0.95);
      background: #f8fafc;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .answer-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    }

    .answer-header {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .answer-emoji {
      font-size: 1.5rem;
      line-height: 1;
      margin-top: 4px;
    }

    .answer-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.4;
      font-family: 'Inter', sans-serif;
    }

    .answer-details p {
      margin: 8px 0 0;
      color: #4b5563;
      font-size: 0.95rem;
      line-height: 1.7;
      font-family: 'Inter', sans-serif;
    }

    .explanation {
      margin-top: 12px;
      color: #334155;
      font-family: 'Inter', sans-serif;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .action-button {
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 700;
      text-transform: none;
      min-width: 140px;
      font-family: 'Inter', sans-serif;
    }

    .home-button {
      border: 1px solid rgba(99, 102, 241, 0.3);
      background: white;
      color: #4338ca;
    }

    .retake-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .home-button .mat-mdc-button-touch-target,
    .retake-button .mat-mdc-button-touch-target,
    .start-button .mat-mdc-button-touch-target {
      border-radius: 6px;
    }

    .start-button {
      padding: 12px 32px;
      border-radius: 6px;
      font-weight: 700;
      text-transform: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: 'Inter', sans-serif;
    }

    .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 64px);
    }

    .no-results-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.95);
      background: white;
      text-align: center;
    }

    .no-results-card p {
      margin: 0;
      color: #4b5563;
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
    }

    @media (max-width: 768px) {
      .results-container {
        padding: 24px 16px;
      }

      .summary-card {
        flex-direction: column;
        align-items: stretch;
      }

      .summary-score {
        width: 100%;
        justify-content: center;
      }

      .action-buttons {
        justify-content: center;
      }
    }

    .answer-item {
      padding: 22px;
      border-radius: 20px;
      border: 1px solid rgba(226, 232, 240, 0.95);
      background: #f8fafc;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .answer-item.correct {
      border-color: rgba(34, 197, 94, 0.35);
      background: rgba(236, 253, 245, 0.9);
    }

    .answer-item.incorrect {
      border-color: rgba(239, 68, 68, 0.35);
      background: rgba(254, 242, 242, 0.9);
    }

    .answer-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
    }

    .answer-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .answer-status mat-icon,
    .answer-status .mat-icon {
      font-size: 24px;
      color: #10b981;
    }

    .icon-incorrect {
      color: #ef4444;
    }

    .answer-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      font-family: 'Inter', sans-serif;
    }

    .answer-details p {
      margin: 6px 0;
      color: #4b5563;
      line-height: 1.7;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
    }

    .explanation {
      margin-top: 12px;
      color: #334155;
      font-family: 'Inter', sans-serif;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 14px 22px;
    }

    .action-button mat-icon {
      margin-right: 8px;
    }

    .no-results {
      display: flex;
      justify-content: center;
      min-height: 360px;
      align-items: center;
    }

    .no-results mat-card {
      padding: 32px;
      border-radius: 24px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      text-align: center;
    }

    @media (max-width: 768px) {
      .results-container {
        padding: 24px 16px;
      }

      .score-card {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }

      .score-info {
        text-align: center;
      }

      .action-buttons {
        justify-content: center;
      }
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
      font-family: 'Inter', sans-serif;
    }

    .explanation {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 8px;
      border-radius: 4px;
      margin-top: 12px !important;
      font-family: 'Inter', sans-serif;
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
    if (percentage >= 60) return 'pass';
    return 'fail';
  }

  getTitleByGrade(grade: string): string {
    const titles: { [key: string]: string } = {
      pass: 'Great Job!',
      fail: 'Keep Practicing'
    };
    return titles[grade] || 'Complete!';
  }

  getFeedback(percentage: number): string {
    if (percentage >= 60) return 'Great job! You have a strong understanding of this topic.';
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
