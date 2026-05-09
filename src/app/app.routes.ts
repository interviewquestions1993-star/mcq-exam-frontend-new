import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';
import { TopicSelectionComponent } from './pages/topic-selection/topic-selection.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'topics/:topic', component: TopicSelectionComponent },
  { path: 'quiz/:topic', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
