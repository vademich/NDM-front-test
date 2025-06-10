import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesTableComponent } from './routes-table.component';

@NgModule({
    declarations: [RoutesTableComponent],
    imports: [CommonModule],
    exports: [RoutesTableComponent]
})
export class RoutesTableModule { }