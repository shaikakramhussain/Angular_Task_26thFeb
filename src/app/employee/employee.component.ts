import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../employeeservice.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  btn: string = 'Create';
  getEmployeeData;
  duplicateId;
  duplicateName;
  buttonDisabled = false;
  constructor(private service: EmployeeService, private formBuilder: FormBuilder) { }
  employeeForm = this.formBuilder.group({
    id: ['', [Validators.required, Validators.pattern('^[0-9\b]+$')]],
    name: ['', [Validators.required]],
    designation: ['', Validators.required]
  })
  ngOnInit() {
    this.getAllEmployeeDetails();
  }
  getAllEmployeeDetails() {
    this.service.getEmployeeDetails().subscribe(res => {
      this.getEmployeeData = res;
    })
  }
  updateEmpData(value) {
    this.service.updateEmployeeDetails(value).subscribe(res => this.getAllEmployeeDetails());
    this.buttonDisabled = false;
    this.employeeForm.reset();
  }
  deleteEmployee(event) {
    this.service.deleteEmployeeById(event).subscribe(res => {
      this.getAllEmployeeDetails();
    })
  }
  submitEmpData(value) {
    let dId = x => x.id === this.employeeForm.controls.id.value
    let dName = x => x.name === this.employeeForm.controls.name.value
    this.duplicateId = this.getEmployeeData.some(dId);
    this.duplicateName = this.getEmployeeData.some(dName);
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    if (this.duplicateId || this.duplicateName) {
      return;
    } 
    else {
    this.service.saveEmployeeDetails(value).subscribe(res => this.getAllEmployeeDetails());
    this.employeeForm.reset(); 
    this.duplicateId =false;
    this.duplicateName =false;
    this.buttonDisabled=false;
    }
  }
  editEmployeeData(value) {
    this.employeeForm.patchValue({
      id: value.id,
      name: value.name,
      designation: value.designation
    })
    this.buttonDisabled= true;
  }
}
