import { fieldDefinitions } from "../../services/state";

const defaultValuesToMask: fieldDefinitions = {
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
};

export default defaultValuesToMask;
