import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioSummary } from '../../../../core/models';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.scss']
})
export class PortfolioSummaryComponent {
  @Input() portfolio: PortfolioSummary | null = null;
  @Input() loading = false;
}
