import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CropService } from '../../services/crop.service';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-crop-management',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, DatePipe ],
  providers: [DatePipe],
  templateUrl: './crop-management.component.html',
  styleUrls: ['./crop-management.component.css']
})
export class CropManagementComponent implements OnInit {
  cropForm!: FormGroup;
  crops: any[] = [];
  isFormVisible = false;
  isEditing = false;
  currentCropId: string | null = null;
  isLoading = true;
  isSubmitting = false;
  generalErrorMessage = '';
  formErrorMessage = '';
  today: string;

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private datePipe: DatePipe
  ) {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.cropForm = this.fb.group({
      cropName: ['', [Validators.required, CustomValidators.lettersOnly()]],
      cropType: ['', [Validators.required, CustomValidators.lettersOnly()]],
      plantingDate: ['', [Validators.required, CustomValidators.noFutureDate()]],
      expectedHarvestDate: ['', [Validators.required, CustomValidators.dateAfter('plantingDate')]],
      area: ['', [Validators.required, Validators.min(0.1)]]
    });
    this.loadCrops();
  }

  loadCrops(): void {
    this.isLoading = true;
    this.generalErrorMessage = '';
    this.cropService.getAllCrops().subscribe({
      next: (data) => { this.crops = data; this.isLoading = false; },
      error: (err) => { this.generalErrorMessage = 'Failed to load crops. Please try again later.'; this.isLoading = false; }
    });
  }

  showCreateForm(): void {
    this.isEditing = false;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentCropId = null;
    this.cropForm.reset();
  }

  showEditForm(crop: any): void {
    this.isEditing = true;
    this.isFormVisible = true;
    this.formErrorMessage = '';
    this.currentCropId = crop._id;
    this.cropForm.setValue({
      cropName: crop.cropName,
      cropType: crop.cropType,
      plantingDate: this.datePipe.transform(crop.plantingDate, 'yyyy-MM-dd'),
      expectedHarvestDate: this.datePipe.transform(crop.expectedHarvestDate, 'yyyy-MM-dd'),
      area: crop.area
    });
  }

  hideForm(): void {
    this.isFormVisible = false;
  }

  onSubmit(): void {
    this.cropForm.markAllAsTouched(); 
    if (this.cropForm.invalid) {
      this.formErrorMessage = 'Please correct all validation errors.';
      return;
    }
    this.isSubmitting = true;
    this.formErrorMessage = '';
    const operation = this.isEditing && this.currentCropId
      ? this.cropService.updateCrop(this.currentCropId, this.cropForm.value)
      : this.cropService.createCrop(this.cropForm.value);
    operation.subscribe({
      next: () => { this.loadCrops(); this.hideForm(); this.isSubmitting = false; },
      error: (err) => { this.formErrorMessage = err.error.message || 'An unexpected error occurred.'; this.isSubmitting = false; }
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this crop record?')) {
      this.generalErrorMessage = '';
      this.cropService.deleteCrop(id).subscribe({
        next: () => { this.loadCrops(); },
        error: (err) => { this.generalErrorMessage = err.error.message || 'Failed to delete crop.'; }
      });
    }
  }
}