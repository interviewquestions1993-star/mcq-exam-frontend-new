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

interface QuizQuestion extends MCQQuestion {
  localId: string;
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
        <div class="loading-card">
          <p class="loader-heading">Preparing your quiz...</p>
          <div class="loading-bar-wrapper">
            <mat-progress-bar mode="determinate" [value]="loadProgress"></mat-progress-bar>
            <div class="loading-progress-text">{{ loadProgress }}% complete</div>
          </div>
          <div class="loading-steps">
            <span *ngFor="let step of loadingSteps" [class.active]="loadProgress >= step.value">{{ step.label }}</span>
          </div>
        </div>
      </div>

      <!-- Quiz State -->
      <div *ngIf="!isLoading && questions.length > 0" class="quiz-state">
        <!-- Progress Bar -->
        <div class="progress-header">
          <div class="progress-info">
            <span class="current-question">Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
            <span class="progress-percentage">{{ getCurrentProgress() }}%</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="getCurrentProgress()"></mat-progress-bar>
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
              <div *ngFor="let option of currentQuestion.options; let i = index; trackBy: trackByOption" class="option">
                <label class="option-label">
                  <input
                    type="radio"
                    [name]="'question-' + currentQuestion.localId"
                    [value]="getOptionLabel(i)"
                    [checked]="getSelectedAnswer(currentQuestion.localId) === getOptionLabel(i)"
                    (change)="onAnswerChange(currentQuestion.localId, getOptionLabel(i))"
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
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  topic: string = '';
  questions: QuizQuestion[] = [];
  currentIndex = 0;
  isLoading = false;
  loadProgress = 0;
  loadingSteps = [
    { value: 10, label: '10% complete' },
    { value: 20, label: '20% complete' },
    { value: 30, label: '30% complete' },
    { value: 40, label: '40% complete' },
    { value: 50, label: '50% complete' },
    { value: 60, label: '60% complete' },
    { value: 70, label: '70% complete' },
    { value: 80, label: '80% complete' },
    { value: 90, label: '90% complete' },
    { value: 100, label: '100% complete' }
  ];
  private loadingInterval: any;
  error: string = '';
  selectedAnswers: { [key: string]: string } = {};
  private moreQuestionsLoading = false;

  get currentQuestion(): QuizQuestion {
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
    this.startLoadingProgress();
    
    // Load initial 2 questions
    this.mcqService.generateQuestions(this.topic, 2).subscribe({
      next: (response: MCQResponse) => {
        this.questions = this.mapQuestions(response.questions);
        this.completeLoadingProgress();
        this.isLoading = false;
        
        // Load 3 more questions in background
        this.loadAdditionalQuestions();
      },
      error: (err) => {
        this.error = 'Failed to load questions. Please try again.';
        this.stopLoadingProgress();
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private loadAdditionalQuestions() {
    this.moreQuestionsLoading = true;
    this.mcqService.generateQuestions(this.topic, 3).subscribe({
      next: (response: MCQResponse) => {
        setTimeout(() => {
          const additional = this.mapQuestions(response.questions);
          additional.forEach(question => this.questions.push(question));
          this.moreQuestionsLoading = false;
        }, 100);
      },
      error: (err) => {
        console.error('Failed to load additional questions:', err);
        this.moreQuestionsLoading = false;
      }
    });
  }

  private startLoadingProgress() {
    this.loadProgress = 0;
    this.stopLoadingProgress();
    this.loadingInterval = setInterval(() => {
      if (this.loadProgress < 90) {
        this.loadProgress += 10;
      } else {
        this.loadProgress = 100;
        this.stopLoadingProgress();
      }
    }, 2000); // 2 seconds per increment for ~20 second total
  }

  private completeLoadingProgress() {
    this.loadProgress = 100;
    this.stopLoadingProgress();
  }

  private stopLoadingProgress() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
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

  trackByOption(index: number, option: string): string {
    return `${this.currentQuestion.localId}-${index}`;
  }

  getCurrentProgress(): number {
    return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
  }

  getSelectedAnswer(localId: string): string {
    return this.selectedAnswers[localId] || '';
  }

  onAnswerChange(localId: string, answer: string) {
    this.selectedAnswers[localId] = answer;
  }

  private mapQuestions(questions: MCQQuestion[]): QuizQuestion[] {
    return questions.map((question, index) => ({
      ...question,
      localId: `${question.id}-${Date.now()}-${Math.random().toString(36).slice(2)}-${index}`
    }));
  }

  submitQuiz() {
    // Calculate score
    let score = 0;
    this.questions.forEach(question => {
      if (this.selectedAnswers[question.localId] === question.correct_answer) {
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
