import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { BaseModel } from 'src/app/models/base-model';
import { BaseService } from 'src/app/service/base.service';

export interface FormItemOptionField {
  label: string,
  value: any,
}
export interface FormItemField {
  type: 'input' | 'select',
  name: string,
  label: string,
  placeholder?: string,
  value?: any,
  options?: FormItemOptionField[],
  multiple?: boolean,
  required: boolean,
  transformFn?: (itemInput: any, value: any) => any,
}

export interface ItemFormInfo<T extends BaseModel> {
  service: BaseService<T>,
  linkPrefix?: string,
  formFields: FormItemField[],
  propertyResolveFn: (formVals: any) => T,
}

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent<T extends BaseModel> implements OnInit {
  @Input() public multiColBodyTempl: TemplateRef<any>;
  @Input() public items: T[];
  @Input() public itemFormInfo: ItemFormInfo<T>;
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
      this.itemFormInfo.formFields.forEach(field => {
        const control = this.selectedItem ? new FormControl(this.selectedItem[field.name]) : new FormControl();
        if (field.required) {
          control.setValidators(Validators.required);
        }
        this.itemForm.addControl(field.name, control);
      });
    });
  }

  getRowValue(itemField: FormItemField, value: string): string {
    return itemField.options.find(o => o.value === value)?.label;
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onItemSubmit() {
    const formVals = this.itemForm.value;
    let itemInput: T = this.itemFormInfo.propertyResolveFn(formVals);

    if (this.selectedItem) {
      itemInput.id = this.selectedItem.id;
      this.itemFormInfo.service.update(itemInput)
        .subscribe(() => this.goBack());
    } else {
      this.itemFormInfo.service.create(itemInput)
      .subscribe(() => {
        this.itemForm.reset();
      });
    }
  }

  onItemDelete() {
    alertify.confirm('Caution',
      'Are you sure you wish to delete this item?',
      () => {
        this.itemFormInfo.service.delete([this.selectedItem])
          .subscribe(() => this.goBack());
      },
      null
    );
  }

}
