import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Holding } from '../../../../core/models';

@Component({
  selector: 'app-holdings-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent {
  @Input() holdings: Holding[] = [];
  @Input() loading = false;
}
