import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    loader: boolean = false;
    invoice: number = 9999999;
    sales: number = 9999999;
    profit: number = 9999999;
    payment: number = 9999999;
    qty: number = 9999999;
    expense: number = 9999999;
    startDate: any;
    endDate: any;
    totalSaleInDayWise: number = 0;
    totalProfitInDayWise: number = 0;
    averageSaleInDayWise: number = 0;
    averageProfitInDayWise: number = 0;
    customer: number = 0;
    supplier: number = 0;
    product: number = 0;
    companyBalance: number = 2021250450;


  ngOnInit() { }

  constructor(
    public dialog: MatDialog,
  ) { }

}
