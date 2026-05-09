import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface Chapter {
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
          <h1>Class {{ classNumber }} - {{ subjectName }}</h1>
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
  subjectName = '';
  chapters: Chapter[] = [];

  get selectedChapters(): Chapter[] {
    return this.chapters.filter(c => c.selected);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.classNumber = +this.route.snapshot.paramMap.get('classNumber')!;
    this.subjectName = this.route.snapshot.paramMap.get('subject')!.replace('-', ' ');
    this.loadChapters();
  }

  loadChapters() {
    // NCERT Chapters data for different subjects and classes
    const chaptersData: { [key: string]: { [key: number]: Chapter[] } } = {
      'science': {
        8: [
          { id: '1', name: 'Crop Production and Management', description: 'Agricultural practices and crop production', selected: false },
          { id: '2', name: 'Microorganisms: Friend and Foe', description: 'Beneficial and harmful microorganisms', selected: false },
          { id: '3', name: 'Synthetic Fibres and Plastics', description: 'Man-made fibres and plastics', selected: false },
          { id: '4', name: 'Materials: Metals and Non-Metals', description: 'Properties and uses of metals and non-metals', selected: false },
          { id: '5', name: 'Coal and Petroleum', description: 'Fossil fuels and their conservation', selected: false },
          { id: '6', name: 'Combustion and Flame', description: 'Types of combustion and flame', selected: false },
          { id: '7', name: 'Conservation of Plants and Animals', description: 'Biodiversity and conservation', selected: false },
          { id: '8', name: 'Cell - Structure and Functions', description: 'Cell structure and organelles', selected: false },
          { id: '9', name: 'Reproduction in Animals', description: 'Asexual and sexual reproduction', selected: false },
          { id: '10', name: 'Reaching the Age of Adolescence', description: 'Changes during puberty', selected: false },
          { id: '11', name: 'Force and Pressure', description: 'Types of forces and pressure', selected: false },
          { id: '12', name: 'Friction', description: 'Types of friction and its effects', selected: false },
          { id: '13', name: 'Sound', description: 'Production and propagation of sound', selected: false },
          { id: '14', name: 'Chemical Effects of Electric Current', description: 'Electrolysis and its applications', selected: false },
          { id: '15', name: 'Some Natural Phenomena', description: 'Lightning, earthquakes and their causes', selected: false },
          { id: '16', name: 'Light', description: 'Reflection, refraction and dispersion', selected: false },
          { id: '17', name: 'Stars and the Solar System', description: 'Celestial bodies and constellations', selected: false },
          { id: '18', name: 'Pollution of Air and Water', description: 'Types of pollution and prevention', selected: false }
        ],
        9: [
          { id: '1', name: 'Matter in Our Surroundings', description: 'Physical nature of matter', selected: false },
          { id: '2', name: 'Is Matter Around Us Pure', description: 'Mixtures, compounds and elements', selected: false },
          { id: '3', name: 'Atoms and Molecules', description: 'Structure of atoms and molecules', selected: false },
          { id: '4', name: 'Structure of the Atom', description: 'Electrons, protons and neutrons', selected: false },
          { id: '5', name: 'The Fundamental Unit of Life', description: 'Cell structure and functions', selected: false },
          { id: '6', name: 'Tissues', description: 'Plant and animal tissues', selected: false },
          { id: '7', name: 'Diversity in Living Organisms', description: 'Classification of living organisms', selected: false },
          { id: '8', name: 'Motion', description: 'Types of motion and equations', selected: false },
          { id: '9', name: 'Force and Laws of Motion', description: 'Newton\'s laws of motion', selected: false },
          { id: '10', name: 'Gravitation', description: 'Universal law of gravitation', selected: false },
          { id: '11', name: 'Work and Energy', description: 'Work, power and energy', selected: false },
          { id: '12', name: 'Sound', description: 'Production and propagation of sound', selected: false },
          { id: '13', name: 'Why Do We Fall Ill', description: 'Health and diseases', selected: false },
          { id: '14', name: 'Natural Resources', description: 'Air, water and soil conservation', selected: false },
          { id: '15', name: 'Improvement in Food Resources', description: 'Crop production and management', selected: false }
        ],
        10: [
          { id: '1', name: 'Chemical Reactions and Equations', description: 'Types of chemical reactions', selected: false },
          { id: '2', name: 'Acids, Bases and Salts', description: 'Properties and reactions', selected: false },
          { id: '3', name: 'Metals and Non-metals', description: 'Physical and chemical properties', selected: false },
          { id: '4', name: 'Carbon and its Compounds', description: 'Organic chemistry basics', selected: false },
          { id: '5', name: 'Periodic Classification of Elements', description: 'Modern periodic table', selected: false },
          { id: '6', name: 'Life Processes', description: 'Nutrition, respiration and transportation', selected: false },
          { id: '7', name: 'Control and Coordination', description: 'Nervous and endocrine systems', selected: false },
          { id: '8', name: 'How do Organisms Reproduce?', description: 'Reproduction in plants and animals', selected: false },
          { id: '9', name: 'Heredity and Evolution', description: 'Genetics and evolution', selected: false },
          { id: '10', name: 'Light - Reflection and Refraction', description: 'Laws of reflection and refraction', selected: false },
          { id: '11', name: 'Human Eye and Colourful World', description: 'Structure of eye and defects', selected: false },
          { id: '12', name: 'Electricity', description: 'Electric current and circuits', selected: false },
          { id: '13', name: 'Magnetic Effects of Electric Current', description: 'Electromagnetism', selected: false },
          { id: '14', name: 'Sources of Energy', description: 'Conventional and non-conventional sources', selected: false },
          { id: '15', name: 'Our Environment', description: 'Ecosystems and environmental issues', selected: false },
          { id: '16', name: 'Management of Natural Resources', description: 'Sustainable development', selected: false }
        ]
      },
      'mathematics': {
        8: [
          { id: '1', name: 'Rational Numbers', description: 'Properties and operations', selected: false },
          { id: '2', name: 'Linear Equations in One Variable', description: 'Solving linear equations', selected: false },
          { id: '3', name: 'Understanding Quadrilaterals', description: 'Types and properties of quadrilaterals', selected: false },
          { id: '4', name: 'Practical Geometry', description: 'Construction of quadrilaterals', selected: false },
          { id: '5', name: 'Data Handling', description: 'Probability and statistics', selected: false },
          { id: '6', name: 'Squares and Square Roots', description: 'Properties and applications', selected: false },
          { id: '7', name: 'Cubes and Cube Roots', description: 'Properties and applications', selected: false },
          { id: '8', name: 'Comparing Quantities', description: 'Ratios, percentages and applications', selected: false },
          { id: '9', name: 'Algebraic Expressions and Identities', description: 'Operations on algebraic expressions', selected: false },
          { id: '10', name: 'Visualising Solid Shapes', description: '3D shapes and their properties', selected: false },
          { id: '11', name: 'Mensuration', description: 'Area and volume of 2D and 3D shapes', selected: false },
          { id: '12', name: 'Exponents and Powers', description: 'Laws of exponents', selected: false },
          { id: '13', name: 'Direct and Inverse Proportions', description: 'Applications in real life', selected: false },
          { id: '14', name: 'Factorisation', description: 'Methods of factorisation', selected: false },
          { id: '15', name: 'Introduction to Graphs', description: 'Linear graphs and applications', selected: false },
          { id: '16', name: 'Playing with Numbers', description: 'Number patterns and properties', selected: false }
        ]
      },
      'social science': {
        8: [
          { id: '1', name: 'How, When and Where', description: 'History - Introduction to history', selected: false },
          { id: '2', name: 'From Trade to Territory', description: 'British expansion in India', selected: false },
          { id: '3', name: 'Ruling the Countryside', description: 'British policies in rural areas', selected: false },
          { id: '4', name: 'Tribals, Dikus and the Vision of a Golden Age', description: 'Tribal societies and British rule', selected: false },
          { id: '5', name: 'When People Rebel', description: '1857 Revolt and its consequences', selected: false },
          { id: '6', name: 'Colonialism and the City', description: 'Urban development under British rule', selected: false },
          { id: '7', name: 'Weavers, Iron Smelters and Factory Owners', description: 'Industrialisation and its impact', selected: false },
          { id: '8', name: 'Civilising the "Native"', description: 'Education and cultural changes', selected: false },
          { id: '9', name: 'Women, Caste and Reform', description: 'Social reforms in 19th century', selected: false },
          { id: '10', name: 'The Changing World of Visual Arts', description: 'Art and cultural expressions', selected: false },
          { id: '11', name: 'The Making of the National Movement', description: 'Early nationalism in India', selected: false },
          { id: '12', name: 'India After Independence', description: 'Post-independence challenges', selected: false }
        ]
      },
      'english': {
        8: [
          { id: '1', name: 'The Best Christmas Present in the World', description: 'Prose - War and friendship', selected: false },
          { id: '2', name: 'The Tsunami', description: 'Prose - Natural disaster survival', selected: false },
          { id: '3', name: 'Glimpses of the Past', description: 'Poetry - Historical perspectives', selected: false },
          { id: '4', name: 'Bepin Choudhury\'s Lapse of Memory', description: 'Prose - Mystery and confusion', selected: false },
          { id: '5', name: 'The Summit Within', description: 'Prose - Mountaineering adventure', selected: false },
          { id: '6', name: 'This is Jody\'s Fawn', description: 'Poetry - Nature and wildlife', selected: false },
          { id: '7', name: 'A Visit to Cambridge', description: 'Prose - Educational journey', selected: false },
          { id: '8', name: 'A Short Monsoon Diary', description: 'Poetry - Seasonal changes', selected: false },
          { id: '9', name: 'The Great Stone Face-I', description: 'Prose - Character and destiny', selected: false },
          { id: '10', name: 'The Great Stone Face-II', description: 'Prose - Character and destiny', selected: false }
        ]
      },
      'hindi': {
        8: [
          { id: '1', name: 'ध्वनि', description: 'कविता - ध्वनि और उसके प्रकार', selected: false },
          { id: '2', name: 'लाख की चूड़ियाँ', description: 'कहानी - पारिवारिक मूल्य', selected: false },
          { id: '3', name: 'बस की यात्रा', description: 'कहानी - यात्रा का अनुभव', selected: false },
          { id: '4', name: 'दीवानों की हस्ती', description: 'कविता - कवि और उनकी रचनाएँ', selected: false },
          { id: '5', name: 'चाँद से थोड़ी सी गप्पें', description: 'निबंध - अंतरिक्ष यात्रा', selected: false },
          { id: '6', name: 'अकबरी लोटा', description: 'कहानी - इतिहासिक घटना', selected: false },
          { id: '7', name: 'क्या निराश हुआ जाए', description: 'कविता - निराशा और आशा', selected: false },
          { id: '8', name: 'सूरदास चरित', description: 'निबंध - सूरदास की जीवनी', selected: false },
          { id: '9', name: 'गलत का फायदा', description: 'कहानी - नैतिक मूल्य', selected: false },
          { id: '10', name: 'एक कहानी यह भी', description: 'कहानी - सामाजिक समस्याएँ', selected: false },
          { id: '11', name: 'स्त्री शिक्षा के विरोधी कथानक', description: 'निबंध - स्त्री शिक्षा', selected: false },
          { id: '12', name: 'अपना-अपना बिस्तर', description: 'कहानी - पारिवारिक जीवन', selected: false },
          { id: '13', name: 'प्रेमचंद के फूल', description: 'कविता - प्रकृति और जीवन', selected: false },
          { id: '14', name: 'संसार पुजारी', description: 'कहानी - सामाजिक यथार्थ', selected: false },
          { id: '15', name: 'कबीर की साखियाँ', description: 'लोक काव्य - कबीर की शिक्षाएँ', selected: false },
          { id: '16', name: 'पर्यावरण संरक्षण', description: 'निबंध - पर्यावरण की रक्षा', selected: false },
          { id: '17', name: 'सुबह का भोजन', description: 'कहानी - दैनिक जीवन', selected: false },
          { id: '18', name: 'नौकर', description: 'कहानी - सामाजिक समस्याएँ', selected: false }
        ]
      }
    };

    const subjectKey = this.subjectName.toLowerCase().replace(' ', '');
    this.chapters = chaptersData[subjectKey]?.[this.classNumber] || [];

    if (this.chapters.length === 0) {
      // Fallback for classes/subjects not yet implemented
      this.chapters = [
        { id: '1', name: 'Chapter 1', description: 'Introduction to the subject', selected: false },
        { id: '2', name: 'Chapter 2', description: 'Basic concepts', selected: false },
        { id: '3', name: 'Chapter 3', description: 'Advanced topics', selected: false }
      ];
    }
  }

  onChapterToggle(chapter: Chapter) {
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
    const quizTopic = `CBSE Class ${this.classNumber} ${this.subjectName}: ${selectedChapterNames.join(', ')}`;

    this.router.navigate(['/quiz', quizTopic]);
  }

  goBack() {
    this.router.navigate(['/cbse', this.classNumber, 'subjects']);
  }
}