import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { CategoriesService } from '../expense/services/categories.service';
import { ItemsService } from '../items/services/items.service';
import { SalesService } from '../sales/services/sales.service';



@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
    displayedColumns: string[] = [
        'code',
        'item_name',
        'thirty_days',
        'fifteen_days',
        'seven_days',
        'prediction_target',
        'actual_stock',
        'required'
    ];

    categories = [];
    suppliers;
    items = [];
    customers = [];
    fromDate: string;
    toDate: string;

    //
    name = 'Angular';
     view: any[] = [1450, 750];
   //view: any[];
//   width = 500;
//     height = 300

     fitContainer: boolean = true;

    public multi = [
        {
          "name": "China",
          "series": [
            {
              "name": "sale",
              "value": '22172'
            },
            {
              "name": "profit",
              "value": '12270'
            }
          ]
        }, {
            "name": "Cqhina",
            "series": [
              {
                "name": "sale",
                "value": '2211'
              },
              {
                "name": "profit",
                "value": '12270'
              }
            ]
          },
          {
            "name": "Ch.ina",
            "series": [
              {
                "name": "sale",
                "value": 22172
              },
              {
                "name": "profit",
                "value": 12270
              }
            ]
          }, {
            "name": "China1",
            "series": [
              {
                "name": "sale",
                "value": 22172
              },
              {
                "name": "profit",
                "value": 12270
              }
            ]
          }, {
            "name": "Ch1ina",
            "series": [
              {
                "name": "sale",
                "value": 22172
              },
              {
                "name": "profit",
                "value": 12270
              }
            ]
          }, {
            "name": "Chin1a",
            "series": [
              {
                "name": "sale",
                "value": 22172
              },
              {
                "name": "profit",
                "value": 12270
              }
            ]
          },
        {
          "name": "USA",
          "series": [
            {
                "name": "sale",
              "value": 6000
            },
            {
                "name": "profit",
              "value": 766
            }
          ]
        },
        {
          "name": "Norway",
          "series": [
            {
                "name": "sale",
              "value": 29625
            },
            {
                "name": "profit",
              "value": 2092
            }          ]
        },
        {
          "name": "Japan",
          "series": [
            {
                "name": "sale",
              "value": 25763
            },
            {
                "name": "profit",
              "value": 20550
            }
          ]
        },
        {
          "name": "Germany",
          "series": [
            {
                "name": "sale",
              "value": 29650
            },
            {
                "name": "profit",
              "value": 12946
            }
          ]
        },
        {
          "name": "Fran04ce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            { "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "France0",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "F30rance",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "F7ran4ce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        },
        {
          "name": "Fra0nce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        },

        {
          "name": "Fra4nce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
         } ,
        {
          "name": "Fran2ce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "Fra44nce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "Fr4e",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "anceaaq",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        },
        {
          "name": "Frn12121ce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "3t6hgfFrance",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "74545",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]
        }
        ,
        {
          "name": "43",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "7raghknce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "Fragh7kn",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "Fragh244knce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "Fra14hknce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "Fraghke",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }
        ,
        {
          "name": "Fraknce",
          "series": [
            {
                "name": "sale",
              "value": 24617
            },
            {
                "name": "profit",
              "value": 19797
            }
          ]

        }

      ];


    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegend = true;
    legendTitle= 'chart';
    legendPosition = 'below';
    showGridLines = true;
    roundDomains= true;
    roundEdges = false;
   // strokeColor = '#FFFFFF';
    strokeWidth = 2;
    showYAxisLabel = true
    yAxisLabel = 'Amount (RS.) ';
    timeline = true;
    doughnut = true;
    colorScheme = {
      domain: ['blue', 'gray']
    };
    // colorScheme = {
    //   domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
    // };



    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = PAGE_SIZE;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = false;
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }

    @ViewChild('select') select: MatSelect;
    allSelectedCategories: boolean = false;
    @ViewChild('select1') select1: MatSelect;
    allSelectedSuppliers: boolean = false;
    @ViewChild('select2') select2: MatSelect;
    allSelectedItems: boolean = false;
    @ViewChild('select3') select3: MatSelect;
    allSelectedCustomers: boolean = false;


    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private categoriesService: CategoriesService,
        private salesService: SalesService,
    ) {}



    ngOnInit(): void {
        this.getCategoryDropDown('Item');
        this.getSuppliersDropDown();
        this.getItemDropDown();
        this.getCustomerDropDown();
    }

    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
    }

    toggleAllSelectionByCategories() {
        if (this.allSelectedCategories) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickCategories() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCategories = newStatus;
    }

    getCategoryDropDown(type: string) {
        this.categoriesService
            .getCategoryDropDown(type)
            .subscribe(
                (response) => {
                    this.categories = response
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
    toggleAllSelectionBySuppliers() {
        if (this.allSelectedSuppliers) {
            this.select1.options.forEach((item: MatOption) => item.select());
        } else {
            this.select1.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickSuppliers() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
    }

    getSuppliersDropDown() {
        // this.selectSupplierLoader = true;
        this.itemsService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.suppliers = response;
                    //this.selectSupplierLoader = false;
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
    toggleAllSelectionByItems() {
        if (this.allSelectedItems) {
            this.select2.options.forEach((item: MatOption) => item.select());
        } else {
            this.select2.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickItems() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
    }

    getItemDropDown() {
      //  this.selectItemLoader = true;
        this.salesService
            .getItemDropDown()
            .subscribe(
                (response) => {
                    this.items = response;
              //      this.selectItemLoader = false;
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
    toggleAllSelectionByCustomers() {
        if (this.allSelectedCustomers) {
            this.select3.options.forEach((item: MatOption) => item.select());
        } else {
            this.select3.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickCustomers() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCustomers = newStatus;
    }

    getCustomerDropDown() {
//this.selectCustomerLoader = true;
        this.salesService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customers = response;
                //    this.selectCustomerLoader = false;
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
