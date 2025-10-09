import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  viewChildren,
  ViewChildren,
} from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { StateService } from '../../services/state';
import { MatTooltipModule } from '@angular/material/tooltip';

interface matDataModel {
  addFieldsToMaskForm: FormGroup;
  maskingTypes: any;
  addEvent: any;
}

/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'dialog-button',
  templateUrl: './dialog-button.html',
  imports: [MatButtonModule, MatIconModule],
})
export class DialogButton {
  private stateService = inject(StateService);

  @Input() control!: FormGroup;

  @Input() dialogButtonText!: string;

  @Input() addFieldsToMaskForm: any;

  @Input() maskingTypes: any;

  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();

  dialog = inject(MatDialog);

  dialogRef: any;

  openDialog() {
    this.dialogRef = this.dialog.open(ShowFieldsDialog, {
      data: {
        addFieldsToMaskForm: this.addFieldsToMaskForm,
        maskingTypes: this.maskingTypes,
        addEvent: this.addEvent,
      },
      width: '80vw',
      minWidth: '80vw',
      height: '90vh',
      minHeight: '90vh',
    });
  }
}

interface dataSources {
  [key: string]: any;
}

@Component({
  selector: 'show-fields-dialog',
  templateUrl: 'show-fields-dialog.html',
  imports: [
    MatTabsModule,
    KeyValuePipe,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
})
export class ShowFieldsDialog {
  stateService = inject(StateService);
  data: matDataModel = inject(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['field', 'fieldName', 'length', 'type', 'delete'];

  dataSources: dataSources = {};
  dataFromSignal = {};
  constructor() {
    effect(() => {
      this.dataSources = {};
      console.log('Value of signal right now');
      console.log(this.stateService.FieldsToMask);
      for (let segment in this.stateService.FieldsToMask) {
        this.dataSources[segment] = new MatTableDataSource(this.stateService.FieldsToMask[segment]);
      }
    });
  }

  ngOnInit() {}

  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator> | undefined;

  @ViewChildren(MatPaginator, { read: ElementRef }) paginatorsRef:
    | QueryList<ElementRef>
    | undefined;

  ngAfterViewInit() {
    console.log(this.paginatorsRef);
    this.setPaginators();
    this.paginatorsRef?.changes.subscribe((change) => {
      console.log('Ref changed : ' + change);
      this.paginatorsRef = change;
      this.setPaginators();
    });

    this.paginators?.changes.subscribe((change) => {
      console.log('Mat paginator change : ' + change);
      this.paginators = change;
      this.setPaginators();
    });
  }

  setPaginators() {
    if (this.paginators && this.paginatorsRef)
      for (let seg in this.dataSources) {
        for (let [index, ref] of this.paginatorsRef?.toArray().entries()) {
          if (ref.nativeElement.id.includes(seg)) {
            this.dataSources[seg].paginator = this.paginators?.get(index);
          }
        }
      }
  }

  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(AddFieldDialog, {
      data: this.data,
      width: '80vw',
      minWidth: '80vw',
      height: '90vh',
      minHeight: '90vh',
    });
  }

  removeField(field: any, segment: string) {
    console.log(field, segment);
    this.stateService.removeField(segment, field);
  }
}

@Component({
  selector: 'add-fild-dialog',
  templateUrl: 'add-field-dialog.html',
  imports: [
    MatTabsModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class AddFieldDialog {
  data: matDataModel = inject(MAT_DIALOG_DATA);

  constructor(public dialogRef: MatDialogRef<AddFieldDialog>) {}

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes: any) {
    console.log('add dialog : ' + changes);
  }

  addField() {
    this.data.addEvent.emit();
    this.dialogRef.close();
  }
}
