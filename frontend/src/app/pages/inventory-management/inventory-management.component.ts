import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  inventoryForm!: FormGroup;
  inventory: any[] = [];

  isFormVisible = false;
  isEditing = false;
  currentItemId: string | null = null;
  
  isLoading = true;
  isSubmitting = false;
  
  generalErrorMessage = '';
  formErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      lowStockThreshold: [10, [Validators.required, Validators.min(0)]]
    });

    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.generalErrorMessage = '';
    this.inventoryService.getAllItems().subscribe({
      next: (data) => {
        this.inventory = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.generalErrorMessage = 'Failed to load inventory. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  showCreateForm(): void {
    this.isEditing = false;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentItemId = null;
    this.inventoryForm.reset({ lowStockThreshold: 10 }); // Reset with default threshold
  }

  showEditForm(item: any): void {
    this.isEditing = true;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentItemId = item._id;
    this.inventoryForm.setValue({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      lowStockThreshold: item.lowStockThreshold
    });
  }

  hideForm(): void {
    this.isFormVisible = false;
  }

  onSubmit(): void {
    this.inventoryForm.markAllAsTouched();
    if (this.inventoryForm.invalid) {
      this.formErrorMessage = 'Please fill out all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.formErrorMessage = '';

    const operation = this.isEditing && this.currentItemId
      ? this.inventoryService.updateItem(this.currentItemId, this.inventoryForm.value)
      : this.inventoryService.createItem(this.inventoryForm.value);

    operation.subscribe({
      next: () => {
        this.loadInventory();
        this.hideForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.formErrorMessage = err.error.message || 'An unexpected error occurred.';
        this.isSubmitting = false;
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      this.generalErrorMessage = '';
      this.inventoryService.deleteItem(id).subscribe({
        next: () => { this.loadInventory(); },
        error: (err) => { this.generalErrorMessage = err.error.message || 'Failed to delete item.'; }
      });
    }
  }
}