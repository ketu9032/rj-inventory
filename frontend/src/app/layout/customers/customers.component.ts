import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  ngOnInit() { }

  constructor(
    public dialog: MatDialog,
  ) { }

}
