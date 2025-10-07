import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { KeyValuePipe } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatGridListModule } from '@angular/material/grid-list';
import { CdkTree, CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { faker, fi } from '@faker-js/faker';
import {MatTabsModule} from '@angular/material/tabs';
import { DialogDataExampleDialog, DialogDataExample } from "../dialog/dialog";


interface field {
  field: number;
  subField?: number | null;
  type: 'Digits' | 'Alphabets' | 'AlphaNumeric';
  length: number;
}

interface fieldDefinitions {
  [key: string]: field[];
}

@Component({
  selector: 'app-phi-mask',
  imports: [
    ReactiveFormsModule,
    ClipboardModule,
    CdkAccordionModule,
    MatGridListModule,
    CdkTreeModule,
    MatTreeModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    DialogDataExample
],
  templateUrl: './phi-mask.html',
  styleUrl: './phi-mask.css',
})
export class PhiMask {
  phiInputFormControl = new FormControl('', [Validators.required]);

  addFieldsToMaskForm = new FormGroup({
    segment: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    field: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    length: new FormControl(null, [Validators.required]),
    subField: new FormControl(null),
  });

  maskedPhiValue: string = '';
  showResults: boolean = false;

  fieldsToMask: fieldDefinitions = {};

  maskingTypes = [
    { value: 'Digits', viewValue: 'Digits' },
    { value: 'Alphabets', viewValue: 'Alphabets' },
    { value: 'AlphaNumeric', viewValue: 'AlphaNumeric' },
  ];

  constructor(private clipboard: Clipboard) {
    let existingFieldsToMaskValue = localStorage.getItem('fieldsToMask');
    if (existingFieldsToMaskValue) {
      this.fieldsToMask = JSON.parse(existingFieldsToMaskValue);
    } else {
      this.fieldsToMask = {
        PID: [
          { field: 3, type: 'AlphaNumeric', subField: 1, length: 15 },
          { field: 4, type: 'AlphaNumeric', subField: 1, length: 15 },
          { field: 5, type: 'AlphaNumeric', subField: 1, length: 20 },
          { field: 5, type: 'AlphaNumeric', subField: 2, length: 20 },
          { field: 5, type: 'AlphaNumeric', subField: 3, length: 20 },
          { field: 7, type: 'Digits', subField: 1, length: 24 },
        ],
      };
      localStorage.setItem('fieldsToMask', JSON.stringify(this.fieldsToMask));
    }
  }

  // ngOnInit() {
  //   this.phiInputFormControl.statusChanges.subscribe((val) => {
  //     if(val == 'VALID') {
  //       this.showResults = true;
  //     }
  //     else {
  //       this.showResults = false;
  //     }
  //   })
  // }

  maskPhi() {
    console.log(this.phiInputFormControl.value);
    if (this.phiInputFormControl.value != null) {
      let value = this.phiInputFormControl.value;
      let split = value.split('\n');
      console.log(split);
      for (let [i, seg] of split.entries()) {
        let splittedFields = seg.split('|');
        if (splittedFields[0] in this.fieldsToMask) {
          for (let [index, val] of splittedFields.entries()) {
            let fields = this.fieldsToMask[splittedFields[0]];
            for (let field of fields) {
              if (field.field == index) {
                if (field.subField == null || field.subField == undefined) {
                  if (field.type == 'Digits') {
                    splittedFields[index] = String(faker.number.int(field.length)).toUpperCase();
                  } else if (field.type == 'Alphabets') {
                    splittedFields[index] = faker.string.alpha(field.length).toUpperCase();
                  } else if (field.type == 'AlphaNumeric') {
                    splittedFields[index] = faker.string.alphanumeric(field.length).toUpperCase();
                  }
                } else {
                  let value = splittedFields[index];
                  let splitted = value.split('^');
                  for (let [index, subVal] of splitted.entries()) {
                    if (index == field.subField - 1) {
                      if (field.type == 'Digits') {
                        splitted[index] = String(faker.number.int(field.length)).toUpperCase();
                      } else if (field.type == 'Alphabets') {
                        splitted[index] = faker.string.alpha(field.length).toUpperCase();
                      } else if (field.type == 'AlphaNumeric') {
                        splitted[index] = faker.string.alphanumeric(field.length).toUpperCase();
                      }
                      break;
                    }
                  }
                  splittedFields[index] = splitted.join('^');
                }
              }
            }
          }
        }
        split[i] = splittedFields.join('|');
      }

      //this.phiInputFormControl.setValue(split.join('\n'));
      this.maskedPhiValue = split.join('\n');
    }
    this.showResults = true;
  }

  addFieldToMask() {
    console.log(this.addFieldsToMaskForm.value);
    console.log(this.addFieldsToMaskForm.valid);

    console.log(this.addFieldsToMaskForm);
    let value = this.addFieldsToMaskForm.value;
    if (value && value.segment && value.field && value.type && value.length) {
      if (value.segment in this.fieldsToMask) {
        this.fieldsToMask[value.segment].push({
          field: parseInt(value.field),
          type: value.type,
          length: parseInt(value.length),
          subField: value.subField,
        });
      } else {
        this.fieldsToMask[value.segment] = [];
        this.fieldsToMask[value.segment].push({
          field: parseInt(value.field),
          type: value.type,
          length: parseInt(value.length),
          subField: value.subField,
        });
      }
    }
    localStorage.setItem('fieldsToMask', JSON.stringify(this.fieldsToMask));
    this.maskPhi();
  }

  // copyToClipboard() {
  //   let element = "maskedPhiValueArea";
  //   const ansElement = typeof element === 'string' ? document.getElementById(element) : element;
  //   if (ansElement) {
  //     const range = document.createRange();
  //     range.selectNodeContents(ansElement);
  //     const selection = window.getSelection();
  //     selection?.removeAllRanges();
  //     selection?.addRange(range);

  //     try {
  //       document.execCommand('copy');
  //       console.log('Content copied to clipboard');
  //     } catch (err) {
  //       console.error('Unable to copy text', err);
  //     }
  //     selection?.removeAllRanges();
  //   }
  // }

  copyToClipboard() {
    const text: string = this.maskedPhiValue || '';
    console.log(text);
    const successful = this.clipboard.copy(text);
  }

  clearPreferences() {
    localStorage.clear();
    this.fieldsToMask = {}
  }
}
