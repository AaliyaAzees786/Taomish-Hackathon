import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showPopup = false;

  toggleInfoPopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup(event: MouseEvent) {
    if ((event.target as Element).classList.contains('popup')) {
      this.showPopup = false;
    }
  }
}
