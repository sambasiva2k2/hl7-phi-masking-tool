import { Injectable, signal, WritableSignal } from '@angular/core';

export interface field {
  field: number;
  subField?: number | null;
  type: 'Digits' | 'Alphabets' | 'AlphaNumeric' | 'ValueSet' | 'Date';
  length: number;
  fieldName: string;
  valueSet?: string[],
  minLength: number
}

export interface fieldDefinitions {
  [key: string]: field[];
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private fieldsToMask: WritableSignal<fieldDefinitions> = signal({});

  addFieldToMask(segment: string, value: field) {
    this.fieldsToMask.update((currentData) => ({
      ...currentData, // Copy other properties
      [segment]: [...currentData[segment], value], // Create a new array with the new item
    }));
  }

  removeField(segment: string, value: field) {
    // this.fieldsToMask.update(currentData => ({
    //   return currentData[segment].filter(item => item.field != value.field && item.subField != value.subField && item.fieldName != value.fieldName)
    // }));
    let newVal = this.FieldsToMask[segment].filter((item: any) => {
      if (item.field == value.field) {
        if (item.subField == value.subField) {
          if (item.fieldName == value.fieldName) {
          } else {
            return item;
          }
        } else {
          return item;
        }
      } else {
        return item;
      }
    });

    if (newVal.length != 0) {
      this.fieldsToMask.update((currentData) => ({
        ...currentData,
        [segment]: newVal,
      }));
    }
    else {
      this.fieldsToMask.update((currentData) => {
        let currentValCopy = {...currentData};
        delete currentValCopy[segment];
        return currentValCopy;
      });
    }

    console.log(this.FieldsToMask);
  }

  setFieldsToMask(value: fieldDefinitions) {
    this.fieldsToMask.set(value);
  }

  get FieldsToMask() {
    return this.fieldsToMask();
  }
}
