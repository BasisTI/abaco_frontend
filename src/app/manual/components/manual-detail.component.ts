import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Manual } from '../model/manual.model';
import { ManualService } from '../manual.service';
import { UploadService } from '../../upload/upload.service';

@Component({
  selector: 'jhi-manual-detail',
  templateUrl: './manual-detail.component.html'
})
export class ManualDetailComponent implements OnInit {

  manual: Manual = new Manual();
  manualArray: Manual[] = [];
  fileName: string = '';


  constructor(
    private manualService: ManualService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.manualService.find(id).subscribe((manual) => {
      this.manual = manual;
      if (manual.arquivoManualId > 0) this.getFileInfo();
      this.manualArray.push(manual);
    });
  }


  getFileInfo() {
    let fileInfo;
    this.uploadService.getFileInfo(this.manual.arquivoManualId).subscribe(response => {
      fileInfo = response;

      this.fileName = fileInfo["originalName"];
    });
  }
}
