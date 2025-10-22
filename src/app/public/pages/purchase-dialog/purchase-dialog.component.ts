// purchase-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';                 // currency pipe
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface PurchaseData {
  brand: string;
  model: string;
  price: number;
}

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class PurchaseDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseData
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirmPurchase(): void {
    this.dialogRef.close(true);
  }
}
