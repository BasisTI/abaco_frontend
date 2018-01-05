import { Injectable } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class PageNotificationService {

    constructor(private messageService: MessageService) { }

    private readonly createMsg = 'Registro incluído com sucesso!';

    private readonly updateMsg = 'Dados alterados com sucesso!';

    private readonly deleteMsg = 'Registro excluído com sucesso!';

    addCreateMsg(title?: string) {
        this.addInfoMsg(this.createMsg, title);
    }

    private addInfoMsg(msg: string, title?: string) {
        this.messageService.add({
            severity: 'info',
            summary: title,
            detail: msg
        });
    }

    addUpdateMsg(title?: string) {
        this.addInfoMsg(this.updateMsg, title);
    }

    addDeleteMsg(title?: string) {
        this.addInfoMsg(this.deleteMsg, title);
    }

}