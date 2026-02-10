import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLinkWithHref, RouterLink, Router } from '@angular/router';
import { DialogButton } from '../../components/dialog/dialog-button';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    DialogButton
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  stateService = inject(StateService);

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

  maskingTypes = [
    { value: 'Digits', viewValue: 'Digits' },
    { value: 'Alphabets', viewValue: 'Alphabets' },
    { value: 'AlphaNumeric', viewValue: 'Alpha Numeric' },
    { value: 'ValueSet', viewValue: 'Value Set' },
    { value: 'Date', viewValue: 'Date' },
  ];

  addFieldToMask() {
    console.log(this.addFieldsToMaskForm.value);
    console.log(this.addFieldsToMaskForm.valid);

    console.log(this.addFieldsToMaskForm);
    let value = this.addFieldsToMaskForm.value;
    if (value && value.segment && value.field && value.type && value.length && value.fieldName) {
      let valueSet = [];
      if (value && value.valueSet && value.valueSet.length > 0) {
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
  }
}
