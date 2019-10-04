import { Observable } from 'rxjs/Rx';

export function translateMessage(message: string
    , callback: (translatedMessage: string, id?: number) => void
    , id?: number) {
    this.translate.get(message).subscribe((translatedMessage: string) => {
        callback.call(this, translatedMessage, id);
    });
}

export function translateMultiple(messages: string[], names: string[], callback: (messages: string[], names: string[]) => void) {
    const result = messages.map(message => this.translate.get(message));
    Observable.forkJoin(result).subscribe(messages => callback.call(this, messages, names));
}

