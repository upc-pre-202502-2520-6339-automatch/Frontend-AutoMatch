import { Component, OnInit } from '@angular/core';
import { BuyerFacade } from '../../application/buyer.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-technical-review',
  templateUrl: './technical-review.component.html',
  styleUrls: ['./technical-review.component.css']
})
export class TechnicalReviewComponent implements OnInit {
  info$!: Observable<any>;

  constructor(private facade: BuyerFacade) {}

  ngOnInit(): void {
    this.info$ = this.facade.technicalInfo$;

    this.facade.loadTechnicalInfo();
  }

  redirectToMTC(): void {
    window.location.href =
      'https://portal.mtc.gob.pe/reportedgtt/form/frmconsultaplacaitv.aspx';
  }
}