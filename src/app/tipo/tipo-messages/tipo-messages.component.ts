import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tipo-messages',
  template: `
    <div *ngIf="temErro()" class="ui-message ui-messages-error">
      {{ text }}
    </div>
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 4px;
    }
  `]
})
export class TipoMessagesComponent implements OnInit {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;
  
  constructor() { }

  temErro(): boolean{
    return this.control.hasError(this.error) && this.control.dirty && this.control.touched ; 
  }

  ngOnInit() {
  }

}
