import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengFileUpload} from '../../componentes/primeng-fileupload';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengRadioButton} from '../../componentes/primeng-radiobutton';
import {PrimengDropdown} from '../../componentes/primeng-dropdown';
import {PrimengCalendar} from '../../componentes/primeng-calendar';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';

export class SistemaPage {
    private promises = [];

    login() {
        const username = 'admin';
        const password = 'admin';
        let css: string;
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {

        PrimengMenu.clickByPath(['Cadastros', 'Sistema']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarSistemasComSucesso() {
        this.promises = [];
        for (let i = 1; i <= 20; i++) {
            PrimengBlockUi.waitBlockUi(2000);
            this.clicarBotao('Novo');

            PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla ${i}`);
            PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Nome ${i}`);

            PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
            PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
            PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia ${i}`);

            if (i !== 2) {
                PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
                PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `ORG ${i} - Organização ${i}`);
            } else {
                PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
                PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `ORG ${i - 1} - Organização ${i - 1}`);
            }

            // Modulo
            PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
            PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), `Módulo ${i}`);
            PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

            // Funcionalidade
            PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
            PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), `Funcionalidade ${i}`);
            PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
            PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), `Módulo ${i}`);
            PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));

            PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));

            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    cadastrarSistemasCamposObrigatórios() {
        this.promises = [];
        // let css: string;
        PrimengBlockUi.waitBlockUi(2000);

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla`);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Sistema`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), ``);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Sistema`);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla`);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();


        // Modulo
        PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), ``);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

        // Funcionalidade
        PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
        PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[1]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[2]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[3]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[4]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                default:
                    return 'OK';
            }
        });

    }

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 1; i < 20; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
    }

    filtrarSigla() {
        let css: string;
        const coluna = 1;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'idTabelaComponentSistema';

        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), 'Sigla 3');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Sigla 3', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), 'sigla 3');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Sigla 3', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ORG 1', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), '@@@');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
    }

    filtrarSistema() {
        let css: string;
        const coluna = 2;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'idTabelaComponentSistema';

        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), 'Nome 3');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Nome 3', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), 'nome 3');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Nome 3', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Nome 1', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), '@@@');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
    }

    filtrarOrganizacao() {
        let css: string;
        const coluna = 2;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'idTabelaComponentSistema';

        PrimengDropdown.selectValueByLocator(by.id('idOrganizacaoComponentSistema'), 'ORG 3 - Organização 3');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ORG 3 - Organização 3', 1, coluna)));
        PrimengDropdown.selectValueByLocator(by.id('idOrganizacaoComponentSistema'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ORG 1 - Organização 1', 1, coluna)));
    }

    verificarFiltrar() {
        this.promises = [];

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao filtrar com texto`;
                case resultados[1]:
                    return `Erro ao filtrar com texto minusculo`;
                case resultados[2]:
                    return `Erro ao filtrar sem texto`;
                case resultados[3]:
                    return `Erro ao filtrar com "@@@"`;
                default:
                    return 'OK';
            }
        });
    }

    verificarFiltrarOrganizacao() {
        this.promises = [];

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao filtrar com texto`;
                case resultados[1]:
                    return `Erro ao filtrar sem texto`;
                default:
                    return 'OK';
            }
        });
    }

}
