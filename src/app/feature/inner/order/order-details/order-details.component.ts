import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownItem } from '@shared/models/dropdown-item.model';
import { ModalService } from '@shared/services/modal.service';
import { CustomerAddEditComponent } from '../../customer/customer-add-edit/customer-add-edit.component';
import { CustomerLookupComponent } from '../../customer/customer-lookup/customer-lookup.component';
import { Customer } from '../../customer/models/customer.model';
import { ServiceService } from '../../other/service.service';
import { Order } from '../models/order';
import { OrderDetailsPagesComponent } from '../order-details-pages/order-details-pages.component';
import { OrderService } from '../order.service';
import { OrderPage } from '../models/order-page.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  customer: Customer;
  orderForm: FormGroup;
  orderTypeList = [];
  selectedType: any;
  orderId: number;
  priorityList: DropdownItem[];
  pages: OrderPage[] = [];

  constructor(
    private dialog: MatDialog,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private serviceService: ServiceService,
    private orderService: OrderService,
    private router: Router,
  ) { }

  /* Lifecycle Hooks */
  ngOnInit() {
    this.buildForm();
    this.subscribeEvents();
    this.initVariables();
    this.getAllServices();
    this.getOrderDetails();
  }

  /* Private Methods */
  private buildForm() {
    this.orderForm = new FormGroup({
      customerName: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      email: new FormControl(null,
        [Validators.pattern('[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]),
      type: new FormControl(null, [Validators.required]),
      subType: new FormControl(null),
      dueDate: new FormControl(''),
      priority: new FormControl(''),
      category: new FormControl(''),
      size: new FormControl(''),
      coverType: new FormControl(''),
      bagType: new FormControl(''),
      pages: new FormControl(''),
      notes: new FormControl(''),
    });
  }

  private subscribeEvents() {
    this.orderForm.get('type').valueChanges
      .subscribe(value => {
        if (value) {
          const selectedItem = this.orderTypeList.find((item) => item.name.toLowerCase() === value.toLowerCase());
          if (selectedItem.child.length > 0) {
            this.orderForm.get('subType').setValidators(Validators.required)
          } else {
            this.orderForm.get('subType').clearValidators();
            this.orderForm.get('subType').updateValueAndValidity();
          }
        }
      });
  }

  private initVariables() {
    this.orderId = parseInt(this.activatedRoute.snapshot.paramMap.get('orderId'), 0);
    this.priorityList = [
      { value: 'Normal', text: 'Normal' },
      { value: 'Medium', text: 'Medium' },
      { value: 'High', text: 'High' }
    ];
  }

  private getAllServices() {
    this.serviceService.getAllServices().subscribe((data) => {
      this.orderTypeList = data
        .filter((item) => item.type.toLowerCase() === 'parent');

      this.orderTypeList.map((item) => {
        item.child = data
          .filter((i) => i.type.toLowerCase() === item.name.toLowerCase());
      });
    });
  }

  private getOrderDetails() {
    if (this.orderId) {
      this.orderService.getOrder(this.orderId).subscribe((data) => {
        this.bindFormData(data);
      });
    }
  }

  private bindFormData(order: Order) {
    this.orderForm.patchValue({
      customerName: order.customerName,
      phone: order.phone,
      email: order.email,
      type: order.type,
      subType: order.subType,
      dueDate: order.dueDate,
      priority: order.priority,
      category: order.category,
      size: order.size,
      pages: order.pages,
      coverType: order.coverType,
      bagType: order.bagType,
      notes: order.notes,
    });
  }

  /* Public Methods */
  lookupCustomer() {
    const dialogConfig = this.modalService.setDialogConfig(true, true, '780px');
    this.dialog.open(CustomerLookupComponent, dialogConfig)
      .afterClosed().subscribe(customer => {
        if (customer) {
          this.customer = customer;
        }
      });
  }

  addCustomer() {
    const dialogConfig = this.modalService.setDialogConfig(true, true, '780px');
    this.dialog.open(CustomerAddEditComponent, dialogConfig)
      .afterClosed().subscribe(customer => {
        if (customer) {
          this.customer = customer;
        }
      });
  }

  setContactAsCustomer() {
    this.orderForm.patchValue({
      customerName: this.customer.name,
      phone: this.customer.phone,
      email: this.customer.email,
    });
  }

  configurePages() {
    const dialogConfig = this.modalService.setDialogConfig(true, true, '100%',
      {
        count: parseInt(this.orderForm.value.pages, 0),
        pages: this.pages
      }, 'order-page-details-dialog');
    this.dialog.open(OrderDetailsPagesComponent, dialogConfig)
      .afterClosed().subscribe(data => {
        if (data.save) {
          this.pages = data.data;
        }
      });
  }

  onTypeSelected(event, type) {

    if (event.isUserInput) {
      this.selectedType = type;
    }

    this.orderForm.patchValue({
      subType: null,
    });
  }

  getPageCount() {
    return parseInt(this.orderForm.value.pages, 0) || 0;
  }

  onSave() {
    let order = new Order();
    if (true) {
      order = this.orderForm.value;
      order.customerId = this.customer.id;
      order.pages = this.pages;
      this.orderService.createOrder(order)
        .subscribe((data) => {
          this.modalService.showNotification('Added new order', 'Close');
          this.router.navigateByUrl(`order/${data.id}/view`);
        });
    } else {
      // employee = this.employeeDetails;
      // employee = Object.assign(employee, this.employeeFormGroup.value);
      // this.updateEmployee(employee);
    }
  }
}
