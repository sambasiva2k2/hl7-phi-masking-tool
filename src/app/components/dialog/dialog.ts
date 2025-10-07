import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { KeyValuePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fi } from '@faker-js/faker';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

interface field {
  field: number;
  subField?: number | null;
  type: 'Digits' | 'Alphabets' | 'AlphaNumeric';
  length: number;
}

interface fieldDefinitions {
  [key: string]: field[];
}

interface matDataModel {
  data: fieldDefinitions;
  addFieldsToMaskForm: FormGroup;
  maskingTypes: any;
  addEvent: any;
}

/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'dialog-data-example',
  templateUrl: './dialog.html',
  imports: [MatButtonModule],
})
export class DialogDataExample {
  @Input() control!: FormGroup;

  @Input() data: fieldDefinitions | undefined;

  @Input() dialogButtonText!: string;

  @Input() addFieldsToMaskForm: any;

  @Input() maskingTypes: any;

  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();

  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogDataExampleDialog, {
      data: {
        data: this.data,
        addFieldsToMaskForm: this.addFieldsToMaskForm,
        maskingTypes: this.maskingTypes,
        addEvent: this.addEvent,
      },
      width: '70vw',
      minWidth: '70vw'
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  imports: [
    MatTabsModule,
    KeyValuePipe,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class DialogDataExampleDialog {
  data: matDataModel = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    console.log(this.data);
  }

  removeField(field: any, segment: string) {
    console.log(field, segment);
    let strFields = localStorage.getItem('fieldsToMask');
    if (strFields) {
      let currentConfig = JSON.parse(strFields);
      for (let segmentFromConfig in currentConfig) {
        if (segmentFromConfig == segment) {
          let arrVal = currentConfig[segmentFromConfig];
          for (let [index, val] of arrVal.entries()) {
            if (val.field == field.field && val.subField == field.subField) {
              arrVal.splice(index, 1);
            }
          }
          if (arrVal.length == 0) {
            delete currentConfig[segmentFromConfig];
          }
        }
      }
      if (currentConfig == null || currentConfig == undefined || Object.keys(currentConfig).length == 0) {
        localStorage.removeItem("fieldsToMask");
        this.data.data = {}
      } else {
        localStorage.setItem('fieldsToMask', JSON.stringify(currentConfig));
        this.data.data = currentConfig;
      }
    }
  }
}
