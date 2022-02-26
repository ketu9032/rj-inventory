import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/models/user';
import {
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from './../../shared/global/table-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { UserService } from './services/user.service';
import { AddUserComponent } from './add-user/add-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'user_name',
    'email',
    'password',
    'date',
    'action'
  ];
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: IUser[] = [];
  public pageSize = PAGE_SIZE;
  public pageSizeOptions = PAGE_SIZE_OPTION;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (newUser) => {
        this.dataSource = new MatTableDataSource<IUser>(newUser);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.open(error.error.message || error.message, 'Ok',{
          duration: 3000
        });
      },
      () => {}
    );
  }

  onAddNewUser(): void {
    this.dialog
      .open(AddUserComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((result) => {
        this.getUser();
      });
  }
  onEditNewUser(element) {
    this.dialog
      .open(AddUserComponent, {
        width: '400px',
        data: element
      })
      .afterClosed()
      .subscribe((result) => {
        this.getUser();
      });
  }
  confirmDialog(id: string): void {
    this.dialog
      .open(DeleteUserComponent, {
        maxWidth: '400px',
        data: id
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.data === true) {
          this.getUser();
        }
      });
  }
}
