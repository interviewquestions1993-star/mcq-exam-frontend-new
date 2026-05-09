import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';
import { TopicSelectionComponent } from './pages/topic-selection/topic-selection.component';
import { CbseComponent } from './pages/cbse/cbse.component';
import { CbseSubjectsComponent } from './pages/cbse-subjects/cbse-subjects.component';
import { CbseChaptersComponent } from './pages/cbse-chapters/cbse-chapters.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'topics/:topic', component: TopicSelectionComponent },
  { path: 'cbse', component: CbseComponent },
  { path: 'cbse/:classNumber/subjects', component: CbseSubjectsComponent },
  { path: 'cbse/:classNumber/subjects/:subject/chapters', component: CbseChaptersComponent },
  { path: 'quiz/:topic', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
