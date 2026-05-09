import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Subject {
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

@Component({
  selector: 'app-cbse-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="cbse-subjects-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <button mat-icon-button class="back-button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Class {{ classNumber }} Subjects</h1>
          <p class="subtitle">Choose a subject to view chapters</p>
        </div>
      </div>

      <!-- Subjects Grid -->
      <div class="subjects-section">
        <div class="subjects-grid">
          <mat-card
            *ngFor="let subject of subjects"
            class="subject-card"
            [class.unavailable]="!subject.available"
            (click)="subject.available ? selectSubject(subject.name) : null"
          >
            <mat-card-content>
              <div class="subject-content">
                <div class="subject-icon">{{ subject.icon }}</div>
                <h3>{{ subject.name }}</h3>
                <p>{{ subject.description }}</p>
                <div *ngIf="!subject.available" class="coming-soon">Coming Soon</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cbse-subjects.component.css']
})
export class CbseSubjectsComponent implements OnInit {
  classNumber = 0;
  subjects: Subject[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.classNumber = +this.route.snapshot.paramMap.get('classNumber')!;
    this.loadSubjects();
  }

  loadSubjects() {
    // Base subjects available for all classes
    const baseSubjects: Subject[] = [
      {
        name: 'Mathematics',
        icon: '🔢',
        description: 'Numbers, Algebra, Geometry & Statistics',
        available: true
      },
      {
        name: 'Science',
        icon: '🧪',
        description: 'Physics, Chemistry & Biology',
        available: true
      },
      {
        name: 'Social Science',
        icon: '🌍',
        description: 'History, Geography & Civics',
        available: true
      },
      {
        name: 'English',
        icon: '📝',
        description: 'Literature, Grammar & Writing',
        available: true
      },
      {
        name: 'Hindi',
        icon: '📚',
        description: 'Language, Literature & Grammar',
        available: true
      }
    ];

    // Add class-specific subjects
    if (this.classNumber >= 9) {
      baseSubjects.push({
        name: 'Computer Science',
        icon: '💻',
        description: 'Programming & Digital Literacy',
        available: false // Coming soon
      });
    }

    if (this.classNumber >= 11) {
      baseSubjects.push({
        name: 'Physics',
        icon: '⚛️',
        description: 'Advanced Physics Concepts',
        available: false // Coming soon
      });
      baseSubjects.push({
        name: 'Chemistry',
        icon: '🧫',
        description: 'Advanced Chemistry Concepts',
        available: false // Coming soon
      });
      baseSubjects.push({
        name: 'Biology',
        icon: '🧬',
        description: 'Advanced Biology Concepts',
        available: false // Coming soon
      });
    }

    this.subjects = baseSubjects;
  }

  selectSubject(subjectName: string) {
    this.router.navigate(['/cbse', this.classNumber, 'subjects', subjectName.toLowerCase().replace(' ', '-'), 'chapters']);
  }

  goBack() {
    this.router.navigate(['/cbse']);
  }
}