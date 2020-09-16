import {browser} from 'protractor';
import {SistemaPage} from './sistema.po';

describe('Abaco - Cadastros Sistemas', function() {
    let page: SistemaPage;
    beforeAll(() => {
        page = new SistemaPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
    });

    // it('Cadastros Sistemas - Cadastrar Sistemas Com Sucesso', function () {
    //     page.login();
    //     page.navegar();
    //     page.cadastrarSistemasComSucesso();
    //     expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    // }, 200000);

    it('Cadastros Sistemas - Cadastrar Sistemas Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarSistemasCamposObrigatórios()).toBe('OK');
    }, 25000);

    /*Pesquisar*/
    it('Cadastros Sistemas - Pesquisar Sigla', function () {
        // page.login();
        page.navegar();
        page.filtrarSigla();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Sistemas - Pesquisar Nome Sistema', function () {
        // page.login();
        page.navegar();
        page.filtrarSistema();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Sistemas - Pesquisar Organização', function () {
        // page.login();
        page.navegar();
        page.filtrarOrganizacao();
        expect(page.verificarFiltrarOrganizacao()).toBe('OK');
    });
});

