import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-cdf',
  templateUrl: './cdf.component.html',
  styleUrls: ['./cdf.component.scss']
})
export class CDFComponent implements OnInit {
  ngOnInit() { }

  constructor(
    public dialog: MatDialog,
  ) { }

}
