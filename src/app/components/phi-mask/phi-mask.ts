import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { ShowFieldsDialog, DialogButton } from '../dialog/dialog-button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../../services/state';
import {MatDividerModule} from '@angular/material/divider';

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
    DialogButton,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './phi-mask.html',
  styleUrl: './phi-mask.css',
})
export class PhiMask {
  stateService = inject(StateService);
  private _snackBar = inject(MatSnackBar);

  phiInputFormControl = new FormControl('', [Validators.required]);

  addFieldsToMaskForm: any = new FormGroup({
    segment: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    field: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    length: new FormControl(null, [Validators.required]),
    minLength: new FormControl(null, [Validators.required]),
    subField: new FormControl(null),
    fieldName: new FormControl(null, [Validators.required]),
    valueSet: new FormControl([]),
  });

  maskedPhiValue: string = '';
  showResults: boolean = false;

  maskingTypes = [
    { value: 'Digits', viewValue: 'Digits' },
    { value: 'Alphabets', viewValue: 'Alphabets' },
    { value: 'AlphaNumeric', viewValue: 'Alpha Numeric' },
    { value: 'ValueSet', viewValue: 'Value Set' },
    { value: 'Date', viewValue: 'Date' },
  ];

  constructor(private clipboard: Clipboard) {
    let existingFieldsToMaskValue = localStorage.getItem('fieldsToMask');
    if (existingFieldsToMaskValue) {
      this.stateService.setFieldsToMask(JSON.parse(existingFieldsToMaskValue));
    } else {
      this.stateService.setFieldsToMask({
        PID: [
          {
            field: 3,
            type: 'AlphaNumeric',
            subField: 1,
            length: 15,
            minLength: 6,
            fieldName: 'Patient Identifier List - ID',
          },
          {
            field: 4,
            type: 'AlphaNumeric',
            subField: 1,
            length: 15,
            minLength: 6,
            fieldName: 'Alternate Patient Identifier List - ID',
          },
          {
            field: 5,
            type: 'AlphaNumeric',
            subField: 1,
            length: 20,
            minLength: 6,
            fieldName: 'Patient Family Name',
          },
          {
            field: 5,
            type: 'AlphaNumeric',
            subField: 2,
            length: 20,
            minLength: 6,
            fieldName: 'Patient Given Name',
          },
          {
            field: 5,
            type: 'AlphaNumeric',
            subField: 3,
            length: 20,
            minLength: 6,
            fieldName: 'Patient Second Name',
          },
          {
            field: 7,
            type: 'Date',
            subField: 1,
            length: 8,
            minLength: 8,
            fieldName: 'Patient DOB',
          },
          {
            field: 8,
            type: 'ValueSet',
            length: 1,
            minLength: 1,
            fieldName: 'Administrative Sex',
            valueSet: ['F', 'M'],
          },
        ],
        IN1: [
          {
            field: 2,
            subField: 1,
            type: 'Digits',
            length: 20,
            minLength: 6,
            fieldName: 'Insurance Plan ID',
          },
        ],
      });
      localStorage.setItem('fieldsToMask', JSON.stringify(this.stateService.FieldsToMask));
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  maskPhi() {
    console.log(this.phiInputFormControl.value);
    if (this.phiInputFormControl.value != null) {
      let value = this.phiInputFormControl.value;
      let split = value.split('\n');
      console.log(split);
      for (let [i, seg] of split.entries()) {
        let splittedFields = seg.split('|');
        if (splittedFields[0] in this.stateService.FieldsToMask) {
          for (let [index, val] of splittedFields.entries()) {
            let fields = this.stateService.FieldsToMask[splittedFields[0]];
            for (let field of fields) {
              if (field.field == index) {
                if (field.subField == null || field.subField == undefined) {
                  if (field.type == 'Digits') {
                    splittedFields[index] = String(
                      faker.number.int({ min: field.minLength, max: field.length })
                    ).toUpperCase();
                  } else if (field.type == 'Alphabets') {
                    splittedFields[index] = faker.string
                      .alpha({ length: { min: field.minLength, max: field.length } })
                      .toUpperCase();
                  } else if (field.type == 'AlphaNumeric') {
                    splittedFields[index] = faker.string
                      .alphanumeric({ length: { min: field.minLength, max: field.length } })
                      .toUpperCase();
                  } else if (field.type == 'ValueSet') {
                    if (field.valueSet) {
                      splittedFields[index] = faker.helpers.arrayElement(field.valueSet);
                    }
                  } else if (field.type == 'Date') {
                    // Generate a date of birth in the past (e.g., up to 18 years ago)
                    const dobDate = faker.date.past({
                      years: 80,
                      refDate: '2006-01-01T00:00:00.000Z',
                    });

                    // Format the date to YYYY-MM-DD
                    const formattedDob: any = dobDate.toISOString().split('T')[0];

                    splittedFields[index] = formattedDob.replaceAll('-', '');
                  }
                } else {
                  let value = splittedFields[index];
                  let splitted = value.split('^');
                  for (let [index, subVal] of splitted.entries()) {
                    if (index == field.subField - 1) {
                      if (field.type == 'Digits') {
                        splitted[index] = String(
                          faker.number.int({ min: field.minLength, max: field.length })
                        ).toUpperCase();
                      } else if (field.type == 'Alphabets') {
                        splitted[index] = faker.string
                          .alpha({ length: { min: field.minLength, max: field.length } })
                          .toUpperCase();
                      } else if (field.type == 'AlphaNumeric') {
                        splitted[index] = faker.string
                          .alphanumeric({ length: { min: field.minLength, max: field.length } })
                          .toUpperCase();
                      } else if (field.type == 'ValueSet') {
                        if (field.valueSet) {
                          splitted[index] = faker.helpers.arrayElement(field.valueSet);
                        }
                      } else if (field.type == 'Date') {
                        // Generate a date of birth in the past (e.g., up to 18 years ago)
                        const dobDate = faker.date.past({
                          years: 80,
                          refDate: '2006-01-01T00:00:00.000Z',
                        });

                        // Format the date to YYYY-MM-DD
                        const formattedDob: any = dobDate.toISOString().split('T')[0];

                        splitted[index] = formattedDob.replaceAll('-', '');
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
    if (value && value.segment && value.field && value.type && value.length && value.fieldName) {
      let valueSet = [];
      if (value && value.valueSet) {
        valueSet = value.valueSet.split('\n');
      }
      if (value.segment in this.stateService.FieldsToMask) {
        this.stateService.addFieldToMask(value.segment, {
          field: parseInt(value.field),
          type: value.type,
          length: parseInt(value.length),
          subField: parseInt(value.subField),
          fieldName: value.fieldName,
          valueSet: valueSet,
          minLength: parseInt(value.minLength),
        });
      } else {
        this.stateService.FieldsToMask[value.segment] = [];
        this.stateService.addFieldToMask(value.segment, {
          field: parseInt(value.field),
          type: value.type,
          length: parseInt(value.length),
          subField: parseInt(value.subField),
          fieldName: value.fieldName,
          valueSet: valueSet,
          minLength: parseInt(value.minLength),
        });
      }
    }
    localStorage.setItem('fieldsToMask', JSON.stringify(this.stateService.FieldsToMask));
    this.addFieldsToMaskForm.reset();
    if (this.phiInputFormControl.dirty) {
      this.maskPhi();
    }
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
    this.openSnackBar('Successfully Copied to clipboard', 'Close');
  }

  clearPreferences() {
    localStorage.clear();
    this.stateService.setFieldsToMask({});
  }
}
