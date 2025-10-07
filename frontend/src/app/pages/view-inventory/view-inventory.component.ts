import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
@Component({
selector: 'app-view-inventory',
standalone: true,
imports: [CommonModule],
templateUrl: './view-inventory.component.html',
styleUrls: ['./view-inventory.component.css']
})
export class ViewInventoryComponent implements OnInit {
inventory: any[] = [];
isLoading = true;
errorMessage = '';
constructor(private inventoryService: InventoryService) {}
ngOnInit(): void {
this.loadInventory();
}
loadInventory(): void {
this.isLoading = true;
this.errorMessage = '';
this.inventoryService.getAllItems().subscribe({
next: (data) => {
this.inventory = data;
this.isLoading = false;
},
error: (err) => {
this.errorMessage = 'Failed to load inventory. Please try again later.';
this.isLoading = false;
}
});
}
}