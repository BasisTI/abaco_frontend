import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';

export class UsuariosPage {
    login() {
        const username = 'admin';
        const password = 'admin';
        let css: string;
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
        css = '.ng-tns-c4-0:nth-child(1) > .ripplelink';
        PrimengComponent.waitToBePresentByLocator(by.css(css), 10000);
    }
    navegar() {
        PrimengMenu.clickByPath(['Configuração', 'Alterar Senha']);
        PrimengBlockUi.waitBlockUi(5000);
    }
}
