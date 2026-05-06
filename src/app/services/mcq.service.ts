import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    // Use environment variable for deployed version, fallback to localhost for development
    const baseUrl = (window as any).__API_URL__ || 'http://localhost:8000';
    return `${baseUrl}/api/mcq/generate`;
  }

  generateQuestions(topic: string, numQuestions: number = 5, difficulty?: string): Observable<MCQResponse> {
    const payload = {
      topic,
      num_questions: numQuestions,
      difficulty: difficulty || null
    };
    return this.http.post<MCQResponse>(this.apiUrl, payload);
  }
}
