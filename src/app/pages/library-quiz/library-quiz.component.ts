import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-quiz',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="library-quiz-card">
      <h2>Library Questions</h2>

      <div *ngIf="!questions || questions.length === 0">
        <p>No questions were loaded. Please go back and select topics from the library.</p>
        <button mat-button (click)="goBack()">Back to Library</button>
      </div>

      <div *ngIf="questions && questions.length">
        <div *ngFor="let q of questions; let i = index" class="q-block">
          <h3>{{ i + 1 }}. {{ q.question }}</h3>
          <ul>
            <li *ngFor="let opt of q.options">{{ opt }}</li>
          </ul>
          <p><strong>Answer:</strong> {{ q.correct_answer }}</p>
          <p *ngIf="q.explanation"><strong>Explanation:</strong> {{ q.explanation }}</p>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goHome()">Done</button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`.library-quiz-card{max-width:900px;margin:24px auto;padding:16px}.q-block{margin-bottom:18px}.actions{margin-top:16px}`]
})
export class LibraryQuizComponent implements OnInit {
  questions: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    try {
      const raw = sessionStorage.getItem('libraryQuestions');
      if (raw) {
        this.questions = JSON.parse(raw) || [];
      }
    } catch (e) {
      this.questions = [];
    }
  }

  goBack() {
    this.router.navigate(['/library']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
