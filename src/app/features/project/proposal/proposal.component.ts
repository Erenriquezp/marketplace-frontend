import { Component } from '@angular/core';

@Component({
  selector: 'app-proposal',
  imports: [],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss'
})
export class ProposalComponent {
  onSubmitProposal(): void {
    console.log('Propuesta enviada');
  }
}
