import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MCQService, MCQResponse } from '../../services/mcq.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatListModule],
  template: `
    <mat-card class="library-card">
      <h2>View Library</h2>

      <div *ngIf="isLoading">Loading topics...</div>

      <div *ngIf="!isLoading && topics.length === 0">No persisted topics found.</div>

      <mat-list *ngIf="!isLoading && topics.length">
        <mat-list-item *ngFor="let t of topics">
          <mat-checkbox [(ngModel)]="selected[t]">{{ t }}</mat-checkbox>
        </mat-list-item>
      </mat-list>

      <div class="actions">
        <button mat-button color="primary" (click)="selectAll()">Select All</button>
        <button mat-button (click)="clearAll()">Clear</button>
        <button mat-raised-button color="accent" (click)="submit()" [disabled]="!hasSelection()">Show MCQs</button>
        <button mat-button (click)="goHome()">Cancel</button>
      </div>
    </mat-card>
  `,
  styles: [`.library-card{max-width:800px;margin:24px auto;padding:16px}.actions{display:flex;gap:8px;margin-top:16px}`]
})
export class LibraryComponent implements OnInit {
  topics: string[] = [];
  selected: Record<string, boolean> = {};
  persisted: MCQResponse[] = [];
  isLoading = false;

  constructor(private mcqService: MCQService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.mcqService.getPersistedResponses().subscribe({
      next: (list) => {
        this.persisted = list || [];
        const set = new Set<string>();
        for (const item of this.persisted) {
          const t = (item.topic || 'Unknown').trim();
          if (t) set.add(t);
        }
        this.topics = Array.from(set).sort();
        for (const t of this.topics) this.selected[t] = false;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectAll() {
    for (const t of this.topics) this.selected[t] = true;
  }

  clearAll() {
    for (const t of this.topics) this.selected[t] = false;
  }

  hasSelection(): boolean {
    return this.topics.some(t => this.selected[t]);
  }

  submit() {
    const chosen = this.topics.filter(t => this.selected[t]);
    const aggregated: any[] = [];
    for (const p of this.persisted) {
      if (chosen.includes((p.topic || '').trim())) {
        aggregated.push(...(p.questions || []));
      }
    }
    // store aggregated questions in sessionStorage and navigate to library-quiz
    sessionStorage.setItem('libraryQuestions', JSON.stringify(aggregated));
    this.router.navigate(['/library-quiz']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
