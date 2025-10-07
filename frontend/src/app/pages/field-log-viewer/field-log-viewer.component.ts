import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FieldLogService } from '../../services/field-log.service';

@Component({
  selector: 'app-field-log-viewer',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './field-log-viewer.component.html',
  styleUrls: ['./field-log-viewer.component.css']
})
export class FieldLogViewerComponent implements OnInit {
  logs: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private fieldLogService: FieldLogService) {}

  ngOnInit(): void {
    this.fieldLogService.getAllFieldLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load field logs.';
        this.isLoading = false;
      }
    });
  }
}