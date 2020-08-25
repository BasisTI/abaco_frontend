import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Manual } from '../manual.model';
import { ManualService } from '../manual.service';
import { UploadService } from '../../upload/upload.service';

@Component({
  selector: 'jhi-manual-detail',
  templateUrl: './manual-detail.component.html',
})
export class ManualDetailComponent implements OnInit, OnDestroy {

  manual: Manual = new Manual() ;
  manualArray: Manual[] = [];
  private subscription: Subscription;
  fileName: string;


  constructor(
    private manualService: ManualService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) { }

  getLabel(label) {
    let str: any;
    return str;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }
  
  load(id) {
    this.manualService.find(id).subscribe((manual) => {
      this.manual = this.manual.copyFromJSON(manual);
      if (manual.arquivoManualId > 0) {
        this.getFileInfo();
      }
      this.manualArray.push(manual);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFileInfo() {
    let fileInfo;
    this.uploadService.getFileInfo(this.manual.arquivoManualId).subscribe(response => {
      fileInfo = response;

      this.fileName = fileInfo["originalName"];
    });
  }
}