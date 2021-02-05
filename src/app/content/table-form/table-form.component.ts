import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { BaseModel } from 'src/app/models/base-model';
import { BaseService } from 'src/app/service/base.service';

/**
 * Represents an option in a select control, used by an instance
 * of a table form component.
 */
export interface FormItemOptionField {
  label: string,
  value: any,
}

/**
 * Represents a form field/control and corresponding table column
 * in an instance of a table form component.
 */
export interface FormItemField {
  type: 'input' | 'checkbox' | 'select' | 'hidden',
  name: string,
  label: string,
  placeholder?: string,
  value?: any,
  options?: FormItemOptionField[],
  multiple?: boolean,
  required: boolean,
  /**
   * Custom logic to map the value from a specific field in the form data for non-trivial cases.
   * 
   * @param item New item object to be sent to service
   * @param fieldValue Value from the form data for this field
   */
  fieldValMapFn?: <T extends BaseModel>(item: Partial<T>, fieldValue: any) => Partial<T>,
}

/**
 * Information needed to initialize an instance of the table form component.
 */
export interface ItemFormInfo<T extends BaseModel> {
  service: BaseService<T>,
  /**
   * Link prefix for routing. If this is not given, onRowSelect handler will be used.
   */
  linkPrefix?: string,
  /**
   * Name of the column to be used as the link for selecting the row.
   */
  linkColumnName: string,
  formFields: FormItemField[],
  /**
   * Custom logic to map the values from the form data for non-trivial cases.
   */
  formDataMapFn?: (formVals: { [key: string]: any }) => T,
}

/**
 * Generic reusable form and table for adding and displaying items.
 */
@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent<T extends BaseModel> implements OnInit {
  @Input() public itemFormInfo: ItemFormInfo<T>;
  @Input() public items: T[];
  @Input() public multiColBodyTempl: TemplateRef<any>;
  
  public selectedItem: T;
  public itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.itemForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const itemId = +params['id'];      
      this.selectedItem = this.itemFormInfo.linkPrefix && itemId ? this.items.find(item => item.id === itemId) : null;

      this.setFormControls();
    });      
  }  

  /**
   * Gets array of form fields, ignoring the ones of type 'hidden'.
   */
  getNonHiddenFormFields = () => this.itemFormInfo.formFields.filter(field => field.type !== 'hidden');

  /**
   * Get the value that will be displayed for a row's column in the table.
   * 
   * @param item The item for this row, containing the value
   * @param itemField The form field for this column, which is being updated
   */
  static getItemDisplayValue<T extends BaseModel>(item: T, itemField: FormItemField): string {
    const itemFieldValue = item[itemField.name];
    if (itemField.type === 'select') {
      const selectedOption = itemField.options.find(o => o.value === itemFieldValue);
      return selectedOption?.label;
    } else if (itemField.type === 'checkbox') {
      return itemFieldValue ? '✔' : '';
    }
    return itemFieldValue;
  }

  /**
   * Handler for Back button being clicked.
   */
  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /**
   * Handler for when the row link is clicked.
   * This is used only if this component isn't utilizing routing.
   */
  onRowSelect(itemId: number): void {
    this.selectedItem = !this.itemFormInfo.linkPrefix && itemId ? this.items.find(item => item.id === itemId) : null;
    if (!this.selectedItem) return;

    this.setFormControls();
  }

  /**
   * Handler for the Add/Update button being clicked.
   */
  onItemSubmit(): void {
    const formVals = this.itemForm.value;
    let itemInput: T = this.itemFormInfo.formDataMapFn ? this.itemFormInfo.formDataMapFn(formVals) : this.getItemFromFormValues(formVals);

    if (this.selectedItem) {
      itemInput.id = this.selectedItem.id;
      this.itemFormInfo.service.update(itemInput)
        .subscribe(() => this.onBack());
    } else {
      this.itemFormInfo.service.create(itemInput)
      .subscribe(() => {
        this.itemForm.reset();
      });
    }
  }

  /**
   * Handler for the Delete button being clicked.
   */
  onItemDelete(): void {
    alertify.confirm('Caution',
      'Are you sure you wish to delete this item?',
      () => {
        this.itemFormInfo.service.delete([this.selectedItem])
          .subscribe(() => this.onBack());
      },
      null
    );
  }
  
  /**
   * Initialize or update the form's controls from the selected item.
   */
  private setFormControls() {
    this.itemFormInfo.formFields.forEach(field => {
      const control = this.selectedItem ? new FormControl(TableFormComponent.getItemFormValue(this.selectedItem, field)) : new FormControl();      
      if (field.required) {
        control.setValidators(Validators.required);
      }
      if (this.itemForm.contains(field.name)) {
        this.itemForm.setControl(field.name, control);
      } else {
        this.itemForm.addControl(field.name, control);
      }
    });
  }

  /**
   * Get the value for setting/updating a form control.
   * 
   * @param item Item containing the value
   * @param itemField Form field to get the value for
   */
  private static getItemFormValue<T extends BaseModel>(item: T, itemField: FormItemField): string[] {
    if (itemField.type === 'select' && itemField.multiple) {
      return itemField.options.reduce((acc: string[], o: FormItemOptionField) => {
        if (item[o.value]) {
          acc.push(o.value);
        }
        return acc;
      }, [])
    }

    return [item[itemField.name]];
  }

  /**
   * Map form data into an object that will be used by the service.
   * 
   * @param formVals Object containing form data. Object properties are the field names.
   */
  private getItemFromFormValues(formVals: { [key: string]: any }) {
    let item: Partial<T> = {};
    for (const propertyName in formVals) {
      if (Object.prototype.hasOwnProperty.call(formVals, propertyName)) {
        const propertyValue = formVals[propertyName];
        if (!propertyValue) continue;

        const itemField = this.itemFormInfo.formFields.find(field => field.name === propertyName);
        if (itemField.fieldValMapFn) {
          item = itemField.fieldValMapFn(item, propertyValue);
        } else {
          if (!itemField.multiple && propertyValue.length && propertyValue.length === 1) {
            item[propertyName] = propertyValue[0];
          } else {
            item[propertyName] = propertyValue;
          }
        }
      }
    }

    return item as T;
  }

}
