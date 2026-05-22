import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPartner } from '../../models/IPartner';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.css'
})
export class PartnerComponent implements OnInit {
  partners: IPartner[] = [];
  isLoading = true;

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.partnerService.getPartners().subscribe({
      next: (data: any) => {
        // L'API peut retourner { data: [...] } ou directement le tableau
        this.partners = Array.isArray(data) ? data : (data?.data ?? []);
        this.isLoading = false;
      },
      error: () => { this.partners = []; this.isLoading = false; }
    });
  }
}