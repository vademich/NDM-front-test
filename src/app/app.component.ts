import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesTableModule } from "./routes-table/routes-table.module";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RoutesTableModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'ndm-system';
}
