import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MCQService, MCQQuestion, MCQResponse } from '../../services/mcq.service';

interface Answer {
  questionId: number;
  selectedAnswer: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="quiz-container">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="loader-ring"><div></div></div>
        <p class="loader-text">Loading questions for {{ topic }}...</p>
      </div>

      <!-- Quiz State -->
      <div *ngIf="!isLoading && questions.length > 0" class="quiz-state">
        <!-- Progress Bar -->
        <div class="progress-header">
          <div class="progress-info">
            <span class="current-question">Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
            <span class="progress-percentage">{{ ((currentIndex + 1) / questions.length * 100) | number: '1.0-0' }}%</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="((currentIndex + 1) / questions.length * 100)"></mat-progress-bar>
        </div>

        <!-- Question Card -->
        <div class="question-card">
          <mat-card class="question-container">
            <!-- Header -->
            <div class="question-header">
              <div class="difficulty-badge" [ngClass]="'difficulty-' + currentQuestion.difficulty">
                {{ currentQuestion.difficulty | uppercase }}
              </div>
            </div>

            <!-- Question Text -->
            <h2 class="question-text">{{ currentQuestion.question }}</h2>

            <!-- Options -->
            <div class="options-container">
              <div *ngFor="let option of currentQuestion.options; let i = index" class="option">
                <label class="option-label">
                  <input
                    type="radio"
                    [name]="'question-' + currentQuestion.id"
                    [value]="getOptionLabel(i)"
                    [(ngModel)]="selectedAnswers[currentQuestion.id]"
                    class="radio-input"
                  />
                  <span class="option-text">{{ option }}</span>
                </label>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button
            mat-stroked-button
            (click)="previousQuestion()"
            [disabled]="currentIndex === 0"
            class="nav-button"
          >
            <mat-icon>arrow_back</mat-icon>
            Previous
          </button>

          <span class="question-counter">{{ currentIndex + 1 }} / {{ questions.length }}</span>

          <button
            *ngIf="currentIndex < questions.length - 1"
            mat-raised-button
            color="primary"
            (click)="nextQuestion()"
            class="nav-button"
          >
            Next
            <mat-icon>arrow_forward</mat-icon>
          </button>

          <button
            *ngIf="currentIndex === questions.length - 1"
            mat-raised-button
            color="accent"
            (click)="submitQuiz()"
            class="nav-button submit-button"
          >
            Submit Quiz
            <mat-icon>check_circle</mat-icon>
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading && questions.length === 0 && error" class="error-state">
        <mat-card>
          <div class="error-content">
            <mat-icon class="error-icon">error_outline</mat-icon>
            <h2>Failed to Load Questions</h2>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="goHome()">
              Try Again
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
      min-height: calc(100vh - 64px);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 20px;
    }

    .loader-ring {
      width: 96px;
      height: 96px;
      position: relative;
    }

    .loader-ring::before,
    .loader-ring::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 10px solid rgba(124, 58, 237, 0.16);
    }

    .loader-ring::after {
      border-top-color: #7c3aed;
      border-right-color: transparent;
      animation: spin 1s linear infinite;
      transform: rotate(45deg);
    }

    .loader-text {
      font-size: 1rem;
      color: #4b5563;
      margin: 0;
      font-weight: 700;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .quiz-state {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .progress-header {
      background: white;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
      font-family: 'Inter', sans-serif;
    }

    .current-question {
      font-weight: 600;
      color: #333;
      font-family: 'Inter', sans-serif;
    }

    .progress-percentage {
      font-weight: 600;
      color: #667eea;
      font-family: 'Inter', sans-serif;
    }

    .question-card {
      flex: 1;
    }

    .question-container {
      padding: 40px;
      background: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .difficulty-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: 'Inter', sans-serif;
    }

    .difficulty-easy {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .difficulty-medium {
      background-color: #fff9c4;
      color: #f57f17;
    }

    .difficulty-hard {
      background-color: #ffcdd2;
      color: #c62828;
    }

    .question-text {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 32px 0;
      line-height: 1.6;
      font-family: 'Inter', sans-serif;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .option {
      display: flex;
      align-items: flex-start;
    }

    .option-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      flex: 1;
      padding: 18px;
      border: 2px solid #e5e7eb;
      border-radius: 18px;
      background: #f8fafc;
      transition: all 0.25s ease;
      font-family: 'Inter', sans-serif;
    }

    .radio-input {
      margin-top: 4px;
      cursor: pointer;
      accent-color: #667eea;
    }

    .option-text {
      flex: 1;
      color: #333;
      font-size: 15px;
      line-height: 1.5;
      font-family: 'Inter', sans-serif;
    }

    .option-label:hover {
      background-color: #f9f9f9;
      border-color: #667eea;
    }

    .radio-input:checked + .option-text {
      font-weight: 600;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      background: white;
      padding: 24px;
      border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      flex-wrap: wrap;
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .nav-button {
      min-width: 160px;
      height: 54px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.02em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 18px 40px rgba(102, 126, 234, 0.18);
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      color: white;
    }

    .nav-button:hover:not(:disabled) {
      transform: translateY(-2px);
      filter: brightness(1.05);
      box-shadow: 0 22px 50px rgba(102, 126, 234, 0.24);
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      color: white;
    }

    .question-counter {
      font-weight: 700;
      color: #4b5563;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
    }

    .submit-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', sans-serif;
    }

    .error-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .error-content {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ef4444;
      margin: 0 auto 20px;
    }

    .error-content h2 {
      font-size: 24px;
      color: #111827;
      margin: 0 0 12px 0;
      font-family: 'Inter', sans-serif;
    }

    .error-content p {
      color: #4b5563;
      margin: 0 0 24px 0;
      font-family: 'Inter', sans-serif;
    }

    @media (max-width: 768px) {
      .quiz-container {
        padding: 16px;
      }

      .question-container {
        padding: 24px;
      }

      .question-text {
        font-size: 18px;
      }

      .navigation-buttons {
        flex-direction: column;
      }

      .nav-button {
        width: 100%;
      }

      .question-counter {
        order: -1;
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class QuizComponent implements OnInit {
  topic: string = '';
  questions: MCQQuestion[] = [];
  currentIndex = 0;
  isLoading = false;
  error: string = '';
  selectedAnswers: { [key: number]: string } = {};

  get currentQuestion(): MCQQuestion {
    return this.questions[this.currentIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mcqService: MCQService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.topic = this.route.snapshot.paramMap.get('topic') || '';
    this.loadQuestions();
  }

  loadQuestions() {
    this.isLoading = true;
    this.error = '';
    this.mcqService.generateQuestions(this.topic, 5).subscribe({
      next: (response: MCQResponse) => {
        this.questions = response.questions;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load questions. Please try again.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  submitQuiz() {
    // Calculate score
    let score = 0;
    this.questions.forEach(question => {
      if (this.selectedAnswers[question.id] === question.correct_answer) {
        score++;
      }
    });

    // Store results and navigate
    sessionStorage.setItem('quizResults', JSON.stringify({
      topic: this.topic,
      score,
      total: this.questions.length,
      percentage: Math.round((score / this.questions.length) * 100),
      answers: this.selectedAnswers,
      questions: this.questions
    }));

    this.router.navigate(['/results']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
