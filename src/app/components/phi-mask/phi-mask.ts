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
import {  DialogButton } from '../dialog/dialog-button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../../services/state';
import {MatDividerModule} from '@angular/material/divider';
import defaultValuesToMask from './default-values-to-mask';
import sampleHL7 from './sample';

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



  maskedPhiValue: string = '';
  showResults: boolean = false;



  constructor(private clipboard: Clipboard) {
    let existingFieldsToMaskValue = localStorage.getItem('fieldsToMask');
    if (existingFieldsToMaskValue && (Object.keys(JSON.parse(existingFieldsToMaskValue)).length != 0)) {
      this.stateService.setFieldsToMask(JSON.parse(existingFieldsToMaskValue));
    } else {
      this.stateService.setFieldsToMask(defaultValuesToMask);
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

      this.maskedPhiValue = split.join('\n');
    }
    this.showResults = true;
  }



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

  addSampleMsgToForm() {
    this.phiInputFormControl.setValue(sampleHL7);
  }
}
