import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export interface MCQResponse {
  topic: string;
  num_questions: number;
  questions: MCQQuestion[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MCQService {
  private apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    // Use environment variable for deployed version, fallback to Render backend if not set
    const baseUrl = (window as any).__API_URL__ || 'https://mcq-exam-backend-new.onrender.com';
    return `${baseUrl}/api/mcq/generate`;
  }

  private getBaseApiUrl(): string {
    const baseUrl = (window as any).__API_URL__ || 'https://mcq-exam-backend-new.onrender.com';
    return `${baseUrl}/api/mcq`;
  }

  generateQuestions(topic: string, numQuestions: number = 5, difficulty?: string): Observable<MCQResponse> {
    const payload = {
      topic,
      num_questions: numQuestions,
      difficulty: difficulty || null
    };

    // Normalize backend variations so frontend always receives { questions: MCQQuestion[] }
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map((resp: any) => {
        // Possible locations for questions in different persisted/returned formats
        const rawQuestions: any[] = resp?.questions ?? resp?.response?.questions ?? resp?.data?.questions ?? [];

        // Normalize each question shape and strip leading labels like "A) " from options
        const questions = (rawQuestions || []).map((q: any, idx: number) => ({
          id: q.id ?? idx + 1,
          question: q.question ?? q.prompt ?? '',
          options: (q.options || []).map((opt: string) => (typeof opt === 'string' ? opt.replace(/^[A-D]\)\s*/i, '').trim() : String(opt))),
          correct_answer: q.correct_answer ?? q.correctAnswer ?? q.answer ?? 'A',
          explanation: q.explanation ?? q.explain ?? '',
          difficulty: q.difficulty ?? q.level ?? 'medium'
        }));

        return {
          topic: resp?.topic ?? topic,
          num_questions: resp?.num_questions ?? questions.length,
          questions,
          status: resp?.status ?? 'success'
        } as MCQResponse;
      })
    );
  }

  // Fetch persisted MCQ responses from backend and normalize shape
  getPersistedResponses(): Observable<MCQResponse[]> {
    const url = `${this.getBaseApiUrl()}/persisted`;
    return this.http.get<any[]>(url).pipe(
      map((list: any[]) => {
        return (list || []).map((resp: any) => {
          const rawQuestions: any[] = resp?.questions ?? resp?.response?.questions ?? resp?.data?.questions ?? [];
          const questions = (rawQuestions || []).map((q: any, idx: number) => ({
            id: q.id ?? idx + 1,
            question: q.question ?? q.prompt ?? '',
            options: (q.options || []).map((opt: string) => (typeof opt === 'string' ? opt.replace(/^[A-D]\)\s*/i, '').trim() : String(opt))),
            correct_answer: q.correct_answer ?? q.correctAnswer ?? q.answer ?? 'A',
            explanation: q.explanation ?? q.explain ?? '',
            difficulty: q.difficulty ?? q.level ?? 'medium'
          }));

          return {
            topic: resp?.topic ?? resp?.search_term ?? 'Unknown',
            num_questions: resp?.num_questions ?? questions.length,
            questions,
            status: resp?.status ?? 'persisted'
          } as MCQResponse;
        });
      })
    );
  }
}
