import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {}

  /**
   * Initialization
   */
  ngOnInit() {
    console.log(this.data);
    console.log(this.data.title);
  }

  /**
   * Handles the dialog close event by returning the changed title.
   * @param changedTitel The changed title value received from the dialog.
   */
  onClose(changedTitel: string): void {
    let putInfo = {
      title: changedTitel,
      id: this.data.id,
      checked: this.data.checked,
    };
    this.dialogRef.close(putInfo);
  }
}
