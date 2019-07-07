import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';

import { UserService } from './user.service';
import { User  } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user : User = new User();
  isMobileExists = false;
  isEmailExists = false;
  isSuccess = false;
  isPosted = false;
  monthDefault = "";
  dateDefault = "";
  yearDefault = "";
  months;
  years;
  dates;

  
  userForm = new FormGroup({
    mobileNumber: new FormControl(this.user.mobileNumber, [Validators.required,Validators.pattern("^\\+62\\d+")]),
    firstName: new FormControl(this.user.firstName, Validators.required),
    lastName: new FormControl(this.user.lastName, Validators.required),
    gender: new FormControl(this.user.gender),
    email: new FormControl(this.user.email, Validators.required),
    year: new FormControl(), 
    month: new FormControl(), 
    date: new FormControl()
  });

  

  constructor(private userService : UserService) { 
  }

  ngOnInit() {
    this.months = [
      {id:"", value:"Month"},
      {id:"01", value:"January"},
      {id:"02", value:"February"},
      {id:"03", value:"March"},
      {id:"04", value:"April"},
      {id:"05", value:"May"},
      {id:"06", value:"June"},
      {id:"07", value:"July"},
      {id:"08", value:"August"},
      {id:"09", value:"September"},
      {id:"10", value:"October"},
      {id:"11", value:"November"},
      {id:"12", value:"December"}
    ];

    this.dates = [
      {id:"", value:"Date"},
      {id:"01", value:"01"},
      {id:"02", value:"02"},
      {id:"03", value:"03"},
      {id:"04", value:"04"},
      {id:"05", value:"05"},
      {id:"06", value:"06"},
      {id:"07", value:"07"},
      {id:"08", value:"08"},
      {id:"09", value:"09"},
      {id:"10", value:"10"},
      {id:"11", value:"11"},
      {id:"12", value:"12"},
      {id:"13", value:"13"},
      {id:"14", value:"14"},
      {id:"15", value:"15"},
      {id:"16", value:"16"},
      {id:"17", value:"17"},
      {id:"18", value:"18"},
      {id:"19", value:"19"},
      {id:"20", value:"20"},
      {id:"21", value:"21"},
      {id:"22", value:"22"},
      {id:"23", value:"23"},
      {id:"24", value:"24"},
      {id:"25", value:"25"},
      {id:"26", value:"26"},
      {id:"27", value:"27"},
      {id:"28", value:"28"},
      {id:"29", value:"29"},
      {id:"30", value:"30"},
	    {id:"31", value:"31"}
    ];

    this.years = [
      {id:"", value:"Year"},
      {id:"2002", value:"2002"},
      {id:"2001", value:"2001"},
      {id:"2000", value:"2000"},
	    {id:"1999", value:"1999"},
	    {id:"1998", value:"1998"},
	    {id:"1997", value:"1997"},
	    {id:"1996", value:"1996"},
	    {id:"1995", value:"1995"},
	    {id:"1994", value:"1994"},
	    {id:"1993", value:"1993"},
	    {id:"1992", value:"1992"},
	    {id:"1991", value:"1991"},
	    {id:"1990", value:"1990"},
	    {id:"1989", value:"1989"},
	    {id:"1988", value:"1988"},
	    {id:"1987", value:"1987"},
	    {id:"1986", value:"1986"},
	    {id:"1985", value:"1985"},
	    {id:"1984", value:"1984"},
	    {id:"1983", value:"1983"},
	    {id:"1982", value:"1982"},
	    {id:"1981", value:"1981"},
	    {id:"1980", value:"1980"}
    ];

    this.userForm.get('year').setValue(this.yearDefault);
    this.userForm.get('month').setValue(this.monthDefault);
    this.userForm.get('date').setValue(this.dateDefault);
  }

  doUserFormSubmit(){
    var gender,year,month,date;
    this.isPosted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.user.mobileNumber = this.userForm.get('mobileNumber').value.trim();
    this.user.firstName = this.userForm.get('firstName').value.trim();
    this.user.lastName = this.userForm.get('lastName').value.trim();
    gender = this.userForm.get('gender').value;
    year = this.userForm.get('year').value;
    month = this.userForm.get('month').value;
    date = this.userForm.get('date').value;
    if(gender == "Male"){
      this.user.gender = "1";
    } else if(gender == "Female") {
      this.user.gender = "0";
    }
    if(year != "" && month != "" && date != ""){
      this.user.dateOfBirth = this.formatDate(new Date(year,month-1,date));
    }
    this.user.email = this.userForm.get('email').value.trim();
    this.doCheckExistsEmail();
    this.doCheckExistsMobile();
    if(this.isMobileExists != true && this.isEmailExists != true){
      this.userService.registerUser(this.user).subscribe(res => {
        if(res.toString() == "1"){
          this.isSuccess = true;
          this.userForm.disable();
          var formSize = document.getElementById("formwindow");
          var height = formSize.offsetHeight;
          document.getElementById("overlay").style.height = (height+2).toString()+"px";
          document.getElementById("overlay").style.display = "block";
          this.userForm.reset();
          this.userForm.get('year').setValue(this.yearDefault);
          this.userForm.get('month').setValue(this.monthDefault);
          this.userForm.get('date').setValue(this.dateDefault);
        }
      });
    }
  }

  doCheckExistsEmail(){
    this.user.email = this.userForm.get('email').value.trim();
    this.userService.isEmailExists(this.user).subscribe(res => {
      if(res.toString() == "1"){
        this.isEmailExists = true;
      } else {
        this.isEmailExists = false;
      }
    });
  }

  doCheckExistsMobile(){
    this.user.mobileNumber = this.userForm.get('mobileNumber').value.trim();
    this.userService.isMobileExists(this.user).subscribe(res => {
      if(res.toString() == "1"){
        this.isMobileExists = true;
      } else {
        this.isMobileExists = false;
      }
    });
  }

  formatDate = function(date : Date) {
    return date.getFullYear()
            + '-' + this.leftpad(date.getMonth() + 1, 2)
            + '-' + this.leftpad(date.getDate(), 2)
            + 'T' + this.leftpad(date.getHours(), 2)
            + ':' + this.leftpad(date.getMinutes(), 2)
            + ':' + this.leftpad(date.getSeconds(), 2);
  }

  leftpad = function(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }

}