import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Permission } from 'src/app/models/permission';
import { PermissionService } from 'src/app/service/user/permission.service';
import { RoleService } from 'src/app/service/user/role.service';
import { FormItemField, TableFormComponent } from './table-form.component';

describe('TableFormComponent', () => {
  let component: TableFormComponent<Permission>;
  let fixture: ComponentFixture<TableFormComponent<Permission>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [ TableFormComponent ],
      providers: [
        RoleService,
        PermissionService,
      ],
    })
    .compileComponents();
  });

  describe('non-static tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent<TableFormComponent<Permission>>(TableFormComponent);
      component = fixture.componentInstance;
    });

    it('should return non hidden fields', () => {
      const hiddenField: FormItemField = {
        type: 'hidden',
        name: 'hiddenTestField',
        label: 'Hidden Test Field',
        required: false,
      };
      component.tableFormInfo = {
        service: undefined,
        linkColumnName: undefined,
        formFields: [
          {
            type: 'input',
            name: 'testField',
            label: 'Test Field',
            required: false,
          }
        ],
      };
      component.tableFormInfo.formFields.push(hiddenField);
      component.items = [];
      fixture.detectChanges();

      const fieldCount = component.tableFormInfo.formFields.length;
      const visibleFormFields = component.getNonHiddenFormFields();
      expect(visibleFormFields.length).toEqual(fieldCount - 1);
      expect(visibleFormFields).not.toContain(hiddenField);
    });
  });

  describe('static tests', () => {
    describe('getItemDisplayValue', () => {
      const item: any = {
        testInputField: 'Input Test Value',
        testCheckboxField: true,
        testSelectField: 'testOptionValue2',
      };

      it('should get input item\'s display value', () => {
        const inputItemField: FormItemField = {
          type: 'input',
          name: 'testInputField',
          label: 'Test Input Field',
          required: false,
        };
        const result = TableFormComponent.getItemDisplayValue(item, inputItemField);
        expect(result).toEqual(item.testInputField);
      });

      it('should get checkbox item\'s display value', () => {
        const checkboxItemField: FormItemField = {
          type: 'checkbox',
          name: 'testCheckboxField',
          label: 'Test Checkbox Field',
          required: false,
        };
        const result = TableFormComponent.getItemDisplayValue(item, checkboxItemField);
        expect(result).toEqual('✔');
      });

      it('should get select item\'s display value', () => {
        const testOptionLabel = { label: 'Test Option Label 2', value: 'testOptionValue2' };
        const selectItemField: FormItemField = {
          type: 'select',
          name: 'testSelectField',
          label: 'Test Select Field',
          required: false,
          options: [
            { label: 'Test Option Label 1', value: 'testOptionValue1' },
          ]
        };
        selectItemField.options.push(testOptionLabel);
        const result = TableFormComponent.getItemDisplayValue(item, selectItemField);
        expect(result).toEqual(testOptionLabel.label);
      });
    });
  });
});
