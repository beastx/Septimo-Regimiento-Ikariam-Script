// ==UserScript==
// @name                  Donations Page Helper
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.DonationsPageHelper = function() {};

Beastx.DonationsPageHelper.prototype.init = function(currentView) {
    this.scriptName = 'Donations Page Helper';
    if (currentView != 'resource' && currentView != 'tradegood') {
        return;
    }
    this.minimunDonationValue = 20500; // enero de 2009
    this.updatePercentForDonations = 15;
    var date = new Date();
    var year = date.getFullYear() - 2009;
    var month = (date.getMonth()) + (year * 12);
    for (var i = 0; i < month; ++i) {
        this.minimunDonationValue = Math.floor(this.minimunDonationValue * ((100 + this.updatePercentForDonations) / 100));
    }
    this.minimunDonationValue = this.minimunDonationValue - (this.minimunDonationValue%1000);
    this.donationsPercentsColors = {
        green: [100, 10000],
        blue: [76, 99],
        orange: [50, 75],
        red: [0, 49]
    };
    this.addBasicStyles();
    this.tableElement = $$('#resourceUsers div.content table')[0];
    this.tableElement.style.fontSize = '0.85em';
    this.addRestOfMinimunDonationData();
    if (Beastx.Config.options.DonationsPageHelper.addOrderLinks) {
        this.addPlayersNamesInEmptyRows();
        this.addOrderLinks();
    }
    this.addInfoForUpgrade();
    this.addColorsLegend();
}

Beastx.DonationsPageHelper.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
    #resourceUsers div.content table tr.green td { color: green; } \
    #resourceUsers div.content table tr.red td { color: red; } \
    #resourceUsers div.content table tr.blue td { color: blue; } \
    #resourceUsers div.content table tr.orange td { color: orange; }\
    .legend { font-size: 0.85em; padding: 0.5em; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.DonationsPageHelper.prototype.addColorsLegend = function() {
    this.tableElement.parentNode.insertBefore(
        this.element('div', { 'class': 'legend' }, [
            this.element('strong', null, ['Nota: ']),
            'Los miembros que tienen mas de 1 polis en esta isla, solo se ven 1 sola vez, y la cantidad de trabajadores es actualizada, sumando los trabajadores de ambas polis.',
            this.element('br'),
            'La columna restante muetra la madera que le falta donar para cumplir con el minimo del mes actual, y entre parentesis el porcentaje donado, con respecto al minimo del mes actual.',
            this.element('br'),
            'Los colores de cada jugador representan el porcentaje donado hasta el momento: ',
            this.element('strong', { style: { color: 'green' } }, [ 'Verde: ' ]),
            this.donationsPercentsColors.green[0]+ '% o mas, ',
            this.element('strong', { style: { color: 'blue' } }, [ 'Azul: ' ]),
            this.donationsPercentsColors.blue[0]+ '% a ' + this.donationsPercentsColors.blue[1] + '%, ',
            this.element('strong', { style: { color: 'orange' } }, [ 'Naranja: ' ]),
            this.donationsPercentsColors.orange[0]+ '% a ' + this.donationsPercentsColors.orange[1] + '%, ',
            this.element('strong', { style: { color: 'red' } }, [ 'Rojo: ' ]),
            'menos de ' + this.donationsPercentsColors.red[1] + '%.',
            this.element('br'),
            'Para el calculo de los recursos restantes se usa la fecha de la pc, por lo que es extrictamente necesario que tengan la fecha bien configurada en sus pcs.'
        ]),
        this.tableElement
    );
}

Beastx.DonationsPageHelper.prototype.addRestOfMinimunDonationData = function() {
    var thead = this.tableElement.childNodes[1];
    var tbody = this.tableElement.childNodes[3];
    var ths = VAR.filter(thead.childNodes[1].childNodes, DOM.cleanChildNodes);
    var trs = VAR.filter(tbody.childNodes, DOM.cleanChildNodes);
    thead.childNodes[1].removeChild(ths[5]);
    thead.childNodes[1].appendChild(this.element('th', null, [ 'Restante' ]));
    for (var i = 0; i < trs.length; ++i) {
        var tds = VAR.filter(trs[i].childNodes, DOM.cleanChildNodes);
        trs[i].removeChild(tds[5]);
        var donated = Number(tds[4].textContent.replace(',', '').trim());
        var minimun = this.minimunDonationValue;
        if (trs[i + 1]) {
            if (!DOM.hasClass(trs[i + 1], 'avatar')) {
                var minimun = this.minimunDonationValue * 2;
            }
        }
        var restante = minimun - donated;
        var donationPercent = parseInt(donated * 100 / minimun);
        DOM.removeAllChildNodes(tds[4]);
        tds[4].appendChild(document.createTextNode(VAR.formatNumberToIkariam(donated)));
        trs[i].appendChild(this.element('td', null, [ VAR.formatNumberToIkariam(restante > 0 ? restante : 0) + ' (' + donationPercent + '% donado)' ]));
        for (var  color in this.donationsPercentsColors) {
            var range = this.donationsPercentsColors[color];
            if (donationPercent >= range[0] && donationPercent <= range[1]) {
                DOM.setHasClass(trs[i], color, true);
            }
        }
    }
}

Beastx.DonationsPageHelper.prototype.addInfoForUpgrade = function() {
    this.boxContainer = $$('#resUpgrade div.content')[0];
    var form = $('donateForm');
    form.parentNode.removeChild(form);
    this.boxContainer.appendChild(
        this.element('h4', null, [ 'Minimo para este mes:' ])
    );
    this.boxContainer.appendChild(
        this.element('p', { style: { textAlign: 'center', fontSize: '0.9em'}}, [ '(Cada mes sube un ' + this.updatePercentForDonations+ ' %)' ])
    );
    this.boxContainer.appendChild(
        this.element('ul', { 'class': 'resources' }, [
            this.element('li', { 'class': 'wood' }, [
                this.element('span', { 'class': 'textLabel' }, [
                    'Madera:'
                ]),
                VAR.formatNumberToIkariam(this.minimunDonationValue)
            ])
        ])
    );
    this.boxContainer.appendChild(
        this.element('h4', null, [ 'Restante para ampliacion:' ])
    );
    this.boxContainer.appendChild(
        this.element('ul', { 'class': 'resources' }, [
            this.element('li', { 'class': 'wood' }, [
                this.element('span', { 'class': 'textLabel' }, [
                    'Madera:'
                ]),
                this.getTotalWoodForUpgrade()
            ])
        ])
    );
    this.boxContainer.appendChild(
        this.element('h4', null, [ 'Total donado hasta el momento:' ])
    );
    this.boxContainer.appendChild(
        this.element('ul', { 'class': 'resources' }, [
            this.element('li', { 'class': 'wood' }, [
                this.element('span', { 'class': 'textLabel' }, [
                    'Madera:'
                ]),
                this.getTotalWoodDonated()
            ])
        ])
    );
    this.boxContainer.appendChild(form);
}

Beastx.DonationsPageHelper.prototype.getTotalWoodForUpgrade = function() {
    var needed = Number($$('#resUpgrade div.content .resources .wood')[0].textContent.replace('Madera:', '').replace(',', '').trim());
    var donated = Number($$('#resUpgrade div.content .resources .wood')[1].textContent.replace('Madera:', '').replace(',', '').trim());
    return VAR.formatNumberToIkariam(needed - donated);
}

Beastx.DonationsPageHelper.prototype.getTotalWoodDonated = function() {
    var total = 0;
    var tbody = this.tableElement.childNodes[3];
    var trs = VAR.filter(tbody.childNodes, DOM.cleanChildNodes);
    for (var i = 0; i < trs.length; ++i) {
        var tds = VAR.filter(trs[i].childNodes, DOM.cleanChildNodes);
        total += Number(tds[4].textContent.replace(',', '').trim());
    }
    return VAR.formatNumberToIkariam(total);
}

Beastx.DonationsPageHelper.prototype.addOrderLinks = function() {
    DOM.addOrderLinksToTable(this.tableElement, DOM.createCaller(this, 'getContentForColumn'), 5);
}

Beastx.DonationsPageHelper.prototype.getContentForColumn = function(columnName, columnContent) {
    if (columnName == 'Nivel') {
        return columnContent.textContent.replace('Nivel ', '');
    } else if (columnName == 'Trabajadores') {
        return columnContent.textContent.split(' ')[0];
    } else if (columnName == 'Donado') {
        return columnContent.textContent.replace(',', '');
    } else if (columnName == 'Restante') {
        return columnContent.textContent.split(' ')[1].replace('%', '').replace('(', '').trim();
    }
    return columnContent.textContent.toLowerCase().trim();
}

Beastx.DonationsPageHelper.prototype.addPlayersNamesInEmptyRows = function() {
    var tbody = this.tableElement.childNodes[3];
    var trs = VAR.filter(tbody.childNodes, DOM.cleanChildNodes);
    for (var i = 0; i < trs.length; ++i) {
        if (!DOM.hasClass(trs[i], 'avatar')) {
            var tds = VAR.filter(trs[i].childNodes, DOM.cleanChildNodes);
            var previousTds = VAR.filter(trs[i - 1].childNodes, DOM.cleanChildNodes);
            previousTds[1].childNodes[0].nodeValue = previousTds[1].childNodes[0].nodeValue + ', ' + tds[1].childNodes[0].nodeValue;
            var workers1 = previousTds[3].childNodes[0].nodeValue.replace('Trabajadores', '').trim();
            var workers2 = tds[3].childNodes[0].nodeValue.replace('Trabajadores', '').trim();
            previousTds[3].childNodes[0].nodeValue = (Number(workers1) + Number(workers2)) + ' Trabajadores (2 polis)';
            trs[i].parentNode.removeChild(trs[i]);
        }
    }
}

Beastx.DonationsPageHelper.prototype.getDefaultConfigs = function() {
    Beastx.Config.options.DonationsPageHelper = {
        enabled: true,
        addOrderLinks: true
    }
}

Beastx.DonationsPageHelper.prototype.getConfigs = function() {
    return {
        addOrderLinks: this.addOrderLinksCheckbox.checked
    };
}

Beastx.DonationsPageHelper.prototype.getOptionBox = function() {
    this.addOrderLinksCheckbox = this.checkbox('addOrderLinks', Beastx.Config.options.DonationsPageHelper.addOrderLinks);
    return this.keyValueTable([
        { label: 'Agregar links para ordenar la tabla', value:  this.addOrderLinksCheckbox}
    ]);
}

Beastx.registerModule(
    'Donations Page Helper',
    'Este modulo nos da ayudas en la paginas de aserraderos, viniedos, minas, y canteras. Agrega info sobre las donaciones, nos permite ordenar de diferentes formas la tabla, etc.'
);