import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Modulo } from '../modulo.model';
import { Subscription } from 'rxjs';
import { ModuloService } from '../modulo.service';

@Component({
  selector: 'jhi-modulo-detail',
  templateUrl: './modulo-detail.component.html'
})
export class ModuloDetailComponent implements OnInit, OnDestroy {

  modulo: Modulo;
  private subscription: Subscription;

  constructor(
    private moduloService: ModuloService,
    private route: ActivatedRoute,
  ) { }

  getLabel(label) {
    return label;
  }


  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.moduloService.find(id).subscribe((modulo) => {
      this.modulo = modulo;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
