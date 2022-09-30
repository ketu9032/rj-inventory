import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { UserService } from '../user/services/user.service';
import { RojMedService } from './services/roj_med.service';



@Component({
  selector: 'app-roj-med',
  templateUrl: './roj-med.component.html',
  styleUrls: ['./roj-med.component.scss']
})
export class RojMedComponent implements OnInit {

    loader: boolean = false;
    fromDate:  any;
    toDate: any;
    users: [] = [];
    currentDate=   moment(new Date()).format("DD/MM/YYYY")


    dataSource: any = [];



  ngOnInit() {

  this.getRojMed()
   }

  constructor(
    private rojMedService: RojMedService,
    public snackBar: MatSnackBar,
  ) { }



  getRojMed() {
    this.rojMedService
        .getRojMedData(this.currentDate)
        .subscribe(
            (response) => {
                this.users = response
            },
            (error) => {
                this.snackBar.open(
                    (error.error && error.error.message) || error.message,
                    'Ok', {
                    duration: 3000
                }
                );
            },
            () => { }
        );
}
}
