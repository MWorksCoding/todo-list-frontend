import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  isDarkTheme: boolean = false;
  @HostBinding('class')
  get themeMode() {
    return this.isDarkTheme ? 'theme-dark' : 'theme-light';
  }

  @HostBinding('style.--mat-toolbar-container-background-color')
  get dialogBackgroundColor() {
    return this.isDarkTheme ? 'var(--mat-toolbar-container-background-color-dark)' : 'var(--mat-toolbar-container-background-color-light)';
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private configs: AppConfigService
  ) {}

  /**
   * Initialization
   */
  ngOnInit() {
    this.configs.isDark$.subscribe((isDark: any) => {
      this.isDarkTheme = isDark;
    });
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
