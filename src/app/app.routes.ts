import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';
import { TopicSelectionComponent } from './pages/topic-selection/topic-selection.component';
import { CbseComponent } from './pages/cbse/cbse.component';
import { CbseSubjectsComponent } from './pages/cbse-subjects/cbse-subjects.component';
import { CbseChaptersComponent } from './pages/cbse-chapters/cbse-chapters.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { PersistedMcqsComponent } from './pages/persisted-mcqs/persisted-mcqs.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'topics/:topic', component: TopicSelectionComponent, canActivate: [AuthGuard] },
  { path: 'cbse', component: CbseComponent, canActivate: [AuthGuard] },
  { path: 'cbse/:classNumber/subjects', component: CbseSubjectsComponent, canActivate: [AuthGuard] },
  { path: 'cbse/:classNumber/subjects/:subject/chapters', component: CbseChaptersComponent, canActivate: [AuthGuard] },
  { path: 'quiz/:topic', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'persisted-mcqs', component: PersistedMcqsComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate: [AuthGuard] },
  { path: 'terms-of-service', component: TermsOfServiceComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
