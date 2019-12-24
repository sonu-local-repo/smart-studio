import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InnerComponent } from './inner.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: InnerComponent,
                children: [
                    {
                        path: 'employee',
                        loadChildren: './employee/employee.module#EmployeeModule',
                        data: { breadcrumb: { label: 'Employee' } }
                    },
                    {
                        path: 'customer',
                        loadChildren: './customer/customer.module#CustomerModule'
                    },
                    {
                        path: 'order',
                        loadChildren: './order/order.module#OrderModule'
                    },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class InnerRoutingModule { }
