import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { NCERT_CURRICULUM } from '../../data/ncert-curriculum';

interface ChapterItem {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-cbse-chapters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="cbse-chapters-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <button mat-icon-button class="back-button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Class {{ classNumber }} - {{ subjectDisplayName }}</h1>
          <p class="subtitle">Select chapters to include in your quiz</p>
        </div>
      </div>

      <!-- Chapters List -->
      <div class="chapters-section">
        <div class="chapters-grid">
          <mat-card *ngFor="let chapter of chapters" class="chapter-card" [class.selected]="chapter.selected">
            <mat-card-content>
              <div class="chapter-header">
                <mat-checkbox
                  [(ngModel)]="chapter.selected"
                  (change)="onChapterToggle(chapter)"
                  color="primary"
                ></mat-checkbox>
                <div class="chapter-info">
                  <h3>{{ chapter.name }}</h3>
                  <p>{{ chapter.description }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Question Count Selector -->
        <div class="question-count-group">
          <label class="count-pill">
            <input
              type="radio"
              name="questionCount"
              [value]="5"
              [(ngModel)]="questionCount"
              class="count-input"
            />
            <div class="pill-content">
              <span class="pill-label">5 Questions</span>
              <span class="pill-subtitle">Default quick set</span>
            </div>
          </label>

          <label class="count-pill">
            <input
              type="radio"
              name="questionCount"
              [value]="10"
              [(ngModel)]="questionCount"
              class="count-input"
            />
            <div class="pill-content">
              <span class="pill-label">10 Questions</span>
              <span class="pill-subtitle">Full practice set</span>
            </div>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            mat-stroked-button
            color="primary"
            class="action-button select-all-button"
            (click)="selectAll()"
          >
            Select All
          </button>
          <button
            mat-stroked-button
            color="accent"
            class="action-button clear-all-button"
            (click)="clearAll()"
          >
            Clear All
          </button>
          <button
            mat-raised-button
            color="primary"
            class="action-button start-quiz-button"
            [disabled]="selectedChapters.length === 0"
            (click)="startQuiz()"
          >
            Start Quiz ({{ selectedChapters.length }} chapters)
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cbse-chapters.component.css']
})
export class CbseChaptersComponent implements OnInit {
  classNumber = 0;
  subjectKey = '';
  subjectDisplayName = '';
  chapters: ChapterItem[] = [];
  questionCount = 5;

  get selectedChapters(): ChapterItem[] {
    return this.chapters.filter(c => c.selected);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.classNumber = +this.route.snapshot.paramMap.get('classNumber')!;
    this.subjectKey = this.route.snapshot.paramMap.get('subject')!;
    this.loadChapters();
  }

  private getClassCurriculum() {
    return NCERT_CURRICULUM.find(item => item.classNumber === this.classNumber);
  }

  private findSubject(subjectKey: string) {
    const curriculum = this.getClassCurriculum();
    return curriculum?.subjects.find(subject => subject.id.replace(/^class\d+-/, '') === subjectKey);
  }

  loadChapters() {
    const subject = this.findSubject(this.subjectKey);

    if (subject) {
      this.subjectDisplayName = subject.name;
      this.chapters = subject.chapters.map(chapter => ({
        id: chapter.id,
        name: chapter.name,
        description: `NCERT syllabus chapter`,
        selected: false
      }));
      return;
    }

    this.subjectDisplayName = this.subjectKey.replace(/-/g, ' ');
    this.chapters = [
      { id: '1', name: 'Chapter 1', description: 'Introduction to the subject', selected: false },
      { id: '2', name: 'Chapter 2', description: 'Basic concepts', selected: false },
      { id: '3', name: 'Chapter 3', description: 'Advanced topics', selected: false }
    ];
  }

  onChapterToggle(chapter: ChapterItem) {
    // Optional: Add any logic when a chapter is toggled
  }

  selectAll() {
    this.chapters.forEach(chapter => chapter.selected = true);
  }

  clearAll() {
    this.chapters.forEach(chapter => chapter.selected = false);
  }

  startQuiz() {
    if (this.selectedChapters.length === 0) {
      this.snackBar.open('Please select at least one chapter to start the quiz.', 'Close', {
        duration: 3000
      });
      return;
    }

    const selectedChapterNames = this.selectedChapters.map(c => c.name);
    const quizTopic = `CBSE Class ${this.classNumber} ${this.subjectDisplayName}: ${selectedChapterNames.join(', ')}`;

    this.router.navigate(['/quiz', quizTopic], {
      queryParams: { count: this.questionCount }
    });
  }

  goBack() {
    this.router.navigate(['/cbse', this.classNumber, 'subjects']);
  }
}