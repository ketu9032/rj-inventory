import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    currentDate= new Date();

    dataSource: any = [];
    // displayedColumns: string[] = [
    //     'id',
    //     'token',
    //     'sales_date',
    //     'customer_name',
    //     'amount',
    //     'past_due',
    //     'total_amount',
    //     'payment',
    //     'total_due',
    //     'other_payment',
    //     'user_name',
    //     'action',
    //     'print'
    // ];


  ngOnInit() {

  this.getRojMed()
   }

  constructor(
    private rojMedService: RojMedService,
    public snackBar: MatSnackBar,
  ) { }



  getRojMed() {
    this.rojMedService
        .getRojMedData()
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
