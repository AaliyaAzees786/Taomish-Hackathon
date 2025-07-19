import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule], // Required!
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  trades = [
    {
      tradeId: 'DRAFT/5746',
      tradeDate: '16/07/2025',
      counterpartyCode: 'Green Technologies',
      buySell: 'BUY',
      commodity: 'Cocoa',
      grade: '-',
      contractTerm: '-',
      periodStartDate: '01/06/2025',
      periodEndDate: '30/06/2025',
      incoterm: 'FOB',
      loadLocation: 'ABU DHABI',
      unloadLocation: 'AFIA-ADABIYA',
      priceType: 'Fixed'
    },
    {
      tradeId: 'DRAFT/5740',
      tradeDate: '17/07/2025',
      counterpartyCode: 'ANT EDIBLE OILS',
      buySell: 'BUY',
      commodity: 'CPL',
      grade: 'RCN-48',
      contractTerm: '-',
      periodStartDate: '17/07/2025',
      periodEndDate: '22/07/2025',
      incoterm: 'CFR',
      loadLocation: 'ABU DHABI',
      unloadLocation: 'ADEN',
      priceType: 'Fixed'
    },
    {
      tradeId: 'DRAFT/5739',
    }
  ]
}