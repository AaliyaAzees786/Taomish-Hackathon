// src/app/app.component.ts
import { Component } from '@angular/core';
import { TableComponent } from './table/table.component'; // ✅ adjust path if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent], // ✅ CRUCIAL PART
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hackathon';
}
