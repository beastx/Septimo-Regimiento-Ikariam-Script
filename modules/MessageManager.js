// ==UserScript==
// @name                  Message Manager
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.MessageManager = function() {};

Beastx.MessageManager.prototype.init = function() {
    this.scriptName = 'Message Manager';
    
    this.ikariamKnownSubjects = [
        'Cancelar convenio de bienes culturales'
    ];
    
    var imgWood				= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAMCAYAAAC9QufkAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH9SURBVHjadJJNSNNxGMc///lvrb3828q1FJ1MKHCjlF4ouihJB4O69HJO8FCX6NC5a0XdeoGgc5ZEkIJ1iBpJRQmh4jxs2pZzm5ub/jfHxl7s3/6/sbJgz+V5+fF9nu/z/T1S6ttTtlsur2rBuWcUkmX6zlxBsdolmpjhf+Ce1p2cPD2Mu8/F/Mt7yKai1gwsN4ItaUaTJJVSyS7yHbt2E4+pvB99wn5Ht3Zw4LzUdHIhr/7jDdUi6Vyte3aNdOQrQf+41nRy+MdPPN1dwjsdGULTUfxhCKQLuCy/6N+Y1JtonsER2jo9goWkC6bvtZ4u4R+7jd3RxoOJVVrym9y6uI+FUEowKJvstBtVEV+9+0iAZV2kaOgzxbWIYPB4NERLzd+84aOz18viizf4zFmShTowXZT/0rbYIrglM7R7ReG6IcaJ4UsE5mbJb2Q4erafpS9BvJWseM/EEiSiYU2nLusC5TYLVIpZjDYLkVhdMN/hXlLRJRSbGbPLyKvn66LedaiHwMP79Axd1mQd2Pgahayg1mioOPayHC+Ig1EcVqaiW0xOrOA2QeunMWSb9RSR8OvaJRlZnklyZ0rj2OyCYGGoWsnMR/n4ISwGDDqr4KwBFYiX7XW19R3evR1nerHCiqqxmkhx7VwHRwYO8N0f+lPv2HapF4aO81uAAQAil+gxsz59XAAAAABJRU5ErkJggg==";
    var imgWine				= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHGSURBVHjaYnx1ag4DOtj38OT/vefPM4iJMjDoyhgy2MmaM7AwMTAiq2FhwAKWnFgGpr//YmH4wXSP4SfTKwZPBl8UNUzomv78Y/gvIAYx78OrPwxf3/1jePLwBYbhGBpBThJXYYbzv7z7z2Dy3Q9DIyOyH1+/+/B/3oTdDFsunmeQU2cFi7Ebf2CQ0YCwHQRCGZzkzRlRbARpOrnkIsOD128YfPQNGfK1/BkaLKIZXh3mhtt8X3YDOODgGs/fePk/KLGLQYyPlyHR3JxBW0SMYcO1ywzzTxxnUDaTAWsC+ffh5d8MZ37thngJFBi/TzwF2wJS/P7zNwYFURGGwzdvMrz4+JlhUpcbw+79dxnUrdihNn9g2M6w+T/L+w8fGNp372JINrdkuPrmFcPqU2cYJJ7xMpQ7u4MVXr59GEyDQpdbCOKzZ/+OIeJx6/VrYNpFUwtMq8tIMtx88pzhxrnX8MARkUaENrP8N56Gjz9+MJjJyzOEm5kwCLFzMtx+85ph/YULDOefPmGYlFPKoH5eg+EYwxkGMQVmhm+f/zNE/KuERAcoREGmgKJCVUWVwS/GACOJgQLwDOcmhndMtxmSuKsYAAIMAHIKugpSnTR5AAAAAElFTkSuQmCC";
    var imgMarble			= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGoSURBVHjahFJdL8NgFH46XddtXZdN4yOWmBAXSCSEGy5dSvxB/8MdQUSQIBIuFqLD0q7ZlK5dt7a8+p6Jj2Tm3PT07Xue83xUsE63MahYqsAcYRRC4xLpdBrJISb8/C4OGg7fBCYWF1C/ucLxwQ1EgWFtuczKE8NfIIlBw5VmqteHXQQdH1G8fPe4Ar3WZP8CXOghtJExRP4LvJaLtufiLQZqOQ529mJGlzrrC8A111Fm2ZxCW4/2D8D7jc2tWH+PeRAE+JMBN0yWZahqHr7fQUbJYW5xhdhIchrFQv7X/b4SnBcbRq0Wuy7Tdi6jeneL6r1OIJqm4cF4JS/6AvDNk9MzKE3Nkn5ejboJv+1BkmRksgqdnVw9fcdIkZXWKbJ8oUAyLOORgNqdEE37FS3Xg+vYcD2fZorDxR7Ac6CwIbWETjxwdrgLMSnCcVyiOr+0Cnl8HO9Rl4YMo46cqpKR/E6Cbw4lDRk5iYZlovvpcBQGeKjquD4/JU8SYu+f4DLEpEQ9jzZhhiP0YpoWPXnOPL5ULIEXpyxEPlzbQk7J0pndbHz59SHAAPFG0oxdJVVKAAAAAElFTkSuQmCC";
    var imgSulfur			= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH0SURBVHjajJJNaxNRFIafGZNp08zEJE3EaFOTCNFaRFqUggURddWFKC5cCP4H8V+4cVNc6cK6caMuBEGQaoVGLA1aJVosbZqONmnMh81kMu1UM85MQYrU4IELF877de49QnnmLp3KK723PmRyDJy8JuzWFzuSg6LVNosMnx1hLjtltdtb1n8L+A8mLYkiohRDbxyiNxrk47sMf4vsKuCAjPIL2FpCil7GaL1lLf+K0sJLHtwZ75wgfPyKpcTT7BE0TO8oPitDfypKS9NpapvIXWXu3bpp3R+/bf0zQXXxKR5JRtkrYKwvs6HXiCfDyEoXP+omp88NUy8v83VlzvojIHp9luP+bfo6oUg3tdUc048maAtR8vN5egIBhkbTLtbn07h0dYDnDye2Ezjk4NExNPUJ4QOD/DSbzL7OkUjLmM0F1KXvtBoNO5Gfvn4FNV9zTzAkIe4kO69eKZWYfPyMUxcuumKLuYI7f7Wyibauc2ZsiC+fqrSaJqrawuPbtx/1zQ032sq8DdYrHDmRwN+tUvhcd53KRQ3ZJvT4I8TiEuljvWRn1kimDiO632VXvaZgCn0Mjpy3QSGaDdON7Tg5FYmFXHGnHANF9rh3YecqO/+vKLP2CqYw9ASGsbq9kaLszCo4fX+gQL2yQaX8i+zkFL8FGABBCeG3MCTxbAAAAABJRU5ErkJggg==";
    var imgCrystal			= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAMCAYAAAC9QufkAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVHjabFLPTxNREP62u12WbdfSLiVSa1OgGIEABWMImiByENFoAvwBXLh68MK/4cmb8Wi4kXA0Bi7EH5Sfxq5GGzCSIpTYlO12a9utD3aq1Y2dy8y8N9+bb755XGb9GRrZT+ZmCWEY160tSFyFa1QjNDp8uhdix3wQ0VAL0uId3JC+skgx+d8Drkbg7SxPvlCuwixb+PgritWMh9lsHODPeYktcvfZ88okS5bb6wVKE49iqUxFacPCk2UNb05EJ+10kYcpWZS84waQ9cnn0QblplVrlNLek7/UXHXS1gwfbnW1UiKLAr78MCFIMpjohSxweL2r4UPiLSYnRuGPz+Jf6q5e7ykuuIFuVab5bOtq9ZA/KZSQ2VmjONYzBL3i1IazVzW/cZndi3cipTM0N4lI7h9g+loMS5sp9Mt5DMRHsJw8JMCjKwb+KE9qDwWqePnpCBFVqYu0+z2PQFXH3fHbuBqUEQkotf17onXqLjt40OcnqmLFwGC7gottbUT58cxETSivG2MdKhbGY3ih6bA/D4G/GTxe6WGoahAre7nafs+7P+wLUZw4yDnmtO92dOXvzHNLBuu4OYWwWMJYLAi/r4W6LW7uY7AzjMOcCfP3OIWCgaxRpLozAQYAw+q/LLa8YygAAAAASUVORK5CYII=";
    
    this.messageTopics = {
        'resource' : {
            subject: 'Recursos',
            items: {
                need: { subject: 'Necesito madera', color: '#ff0000', icon: imgWood },
                have: { subject: 'Tengo', color: '#333', icon: imgWine }
            }
        },
        'museum' : {
            subject: 'Museos',
            items: {
                ownFreeSpace: { subject: 'Tengo espacios libres', color: '#333', icon: imgMarble },
                freeSpace: { subject: 'Jugador con espacios libres', color: '#333', icon: imgSulfur }
            }
        },
        'batle' : {
            subject: 'Batalla',
            items: {
                needHelp: { subject: 'Necesito ayuda', color: '#333', icon: imgCrystal },
                report: { subject: 'Reportar batalla', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' }
            }
        },
        'alliance' : {
            subject: 'Alianza',
            items: {
                news: { subject: 'Noticias', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' },
                donation: { subject: 'Donaciones', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' },
                scriptsUpdate: { subject: 'Actualizacion de los scripts', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' },
                scriptsHelp: { subject: 'Ayuda de los scripts', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' }
            }
        },
        'misc' : {
            subject: 'Varios',
            items: {
                joke: { subject: 'Humor', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' },
                meeting: { subject: 'Reuniones', color: '#333', icon: 'http://s2.ar.ikariam.com/skin/layout/icon-world.gif' }
            }
        }
    };
    
    if (IkaTools.getView() == 'sendIKMessage') {
        this.addStylesForTopicSelector();
        this.addMessageTopicSelectorBox();
        this.addMessageTopicInput();
        this.registerListenerForButtonClick();
    }
    
    if (IkaTools.getView() == 'diplomacyAdvisor') {
        this.messagesContainer = $$('#messages tbody')[0];
        if (Beastx.Config.options.MessageManager.showAmmount > 10) {
            this.actualLocalPage = 1;
            this.actualRemotePage = 0;
            this.loadedPages = 1;
            this.remoteMessages = [];
            this.showMeesagesPerPage = parseInt(Beastx.Config.options.MessageManager.showAmmount);
            this.showLoadingMessages(true);
            this.getMoreMessages(this.actualRemotePage);
            this.addStylesForShowMoreThanOnePage();
            for (i = 1; i < this.messagesContainer.childNodes.length; ++i) {
                if (!DOM.hasClass(this.messagesContainer.childNodes[i], 'entry') && !DOM.hasClass(this.messagesContainer.childNodes[i], 'text')) {
                    if (this.messagesContainer.childNodes[i].style) { this.messagesContainer.childNodes[i].style.display = 'none'; }
                }
            }
            this.addListener('onremotemessagesload', this.caller('parseMessages'));
        } else {
            this.parseMessages();
        }
    }
}

Beastx.MessageManager.prototype.addStylesForShowMoreThanOnePage = function() {
    var default_style = <><![CDATA[
    #messages tbody tr td { font-size: 0.9em; }\
    #messages tbody tr th:first-child { display: none; }\
    #messages tbody tr th:first-child + th{ display: none; }\
    #messages tbody tr th:first-child + th + th + th +th{ display: none; }\
    #messages tbody tr.entry td { border-left: 1px dotted #E4B873; }\
    #messages tbody tr.entry td:first-child { display: none; }\
    #messages tbody tr.entry td:first-child + td{ display: none; }\
    #messages tbody tr.entry td:first-child + td + td + td +td{ display: none; }\
    #messages tbody tr.entry td:first-child + td + td{ width: 100px; }\
    #messages tbody tr.entry td:first-child + td + td + td { width: 400px; }\
    #messages tbody tr.entry td:first-child + td + td + td +td + td { width: 100px; }\
    #diplomacyAdvisor #container #mainview #messages tbody tr.text td.msgText a.parsedLink { color: #434A93; text-decoration: underline; }\
    .moreLinksContainer { text-align: center; }\
    .moreLinksContainer input { margin-left: 1em; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.MessageManager.prototype.addStylesForTopicSelector = function() {
    var default_style = <><![CDATA[
    #messageTopicSelector { padding: 1em; }\
    #messageTopicSelector .subjectCategory {font-weight: bold; }\
    #messageTopicSelector ul.categoryItems li.item { padding-left: 1em; }
    #messageTopicSelector ul.categoryItems li.item a img { display: inline; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.MessageManager.prototype.getMoreMessages = function(page) {
    ++this.actualRemotePage;
    var me = this;
    IkaTools.getRemoteDocument(
        'http://s2.ar.ikariam.com/index.php?view=diplomacyAdvisor&start=' + (this.actualRemotePage * 10),
        function(responseDocument) { me.onGetMoreMessagesLoad(responseDocument, page); }
    );
    if ((this.showMeesagesPerPage * this.actualLocalPage) > ((this.actualRemotePage + 1) * 10)) {
        this.getMoreMessages(this.actualRemotePage);
    }
}

Beastx.MessageManager.prototype.showLoadingMessages = function(showLoading) {
    document.body.style.opcity = showLoading ? '0.5' : '1';
}

Beastx.MessageManager.prototype.onGetMoreMessagesLoad = function(responseDocument, page) {
    var remoteMessages = $$('#messages tbody tr', responseDocument);
    responseDocument.innerHTML = '';
    ++this.loadedPages;
    this.remoteMessages[page] = [];
    for (i = 0; i < remoteMessages.length; ++i) {
        if (DOM.hasClass(remoteMessages[i], 'entry') || DOM.hasClass(remoteMessages[i], 'text')) {
            this.remoteMessages[page].push(remoteMessages[i]);
        }
    }
     if ((this.showMeesagesPerPage) == (this.loadedPages * 10)) {
         for (var page in this.remoteMessages) {
             for (var j = 0; j < this.remoteMessages[page].length; ++j) {
                this.messagesContainer.appendChild(this.remoteMessages[page][j]);
             }
        }
        this.showLoadingMessages(false);
        this.addMoreMessagesLinks();
        this.dispatchEvent('remotemessagesload');
    }
}

Beastx.MessageManager.prototype.addMoreMessagesLinks = function() {
    this.moreLinks = this.element('div', { 'class': 'moreLinksContainer' }, [
        this.element('strong', null, [
            'Viendo mensajes: ',
            ((this.actualLocalPage - 1) * this.showMeesagesPerPage) + 1,
            ' a ',
            (this.actualLocalPage * this.showMeesagesPerPage)
        ]),
        this.actualLocalPage == 1 ? null : this.element('input', { type: 'button', 'class': 'button', onclick: this.caller('setPageLess'), value: 'Anterior' }),
        this.element('input', { type: 'button', 'class': 'button', onclick: this.caller('setPageMore'), value: 'Siguiente' })
    ]);
    this.messagesContainer.parentNode.parentNode.appendChild(this.moreLinks);
}

Beastx.MessageManager.prototype.setPageMore = function() {
    ++this.actualLocalPage;
    this.setPage();
}

Beastx.MessageManager.prototype.setPageLess = function() {
    --this.actualLocalPage;
    this.actualRemotePage = this.actualRemotePage - ((this.showMeesagesPerPage / 10) * 2);
    this.setPage();
}

Beastx.MessageManager.prototype.setPage = function() {
    if (this.moreLinks) {
        this.messagesContainer.parentNode.parentNode.removeChild(this.moreLinks);
    }
    var header = this.messagesContainer.getElementsByTagName('tr')[0];
    DOM.removeAllChildNodes(this.messagesContainer);
    this.messagesContainer.appendChild(header);
    
    this.loadedPages = 0;
    this.remoteMessages = [];
    this.getMoreMessages(this.actualRemotePage);
}

Beastx.MessageManager.prototype.addMessageTopicInput = function() {
    this.subjectInput = this.element('input', { type: 'hidden' });
    var ikaSubjectContainer = $('mailSubject');
    ikaSubjectContainer.parentNode.insertBefore(this.subjectInput, ikaSubjectContainer);
}

Beastx.MessageManager.prototype.registerListenerForButtonClick = function() {
    var button = $$('#notice form div.centerButton input')[0];
    DOM.addListener(button, 'click', this.caller('onSendMessageButtonClick'));
}

Beastx.MessageManager.prototype.onSendMessageButtonClick = function(event) {
    DOM.cancelEvent(event);
    var form = $$('#notice form')[0];
    if (this.subjectInput.value == '') {
        var sendWithEmptySubject = confirm('No elijio un asunto para el mensaje.. Enviar de todas formas?');
        if (sendWithEmptySubject) {
            form.submit();
        } else {
            return false;
        }
    }
    var textArea = $$('#notice form textarea#text')[0];
    var msgText = textArea.value;
    textArea.value = this.subjectInput.value + ' \n' + msgText;
    form.submit();
}

Beastx.MessageManager.prototype.addMessageTopicSelectorBox = function() {
    IkaTools.addInfoBox(
        'Tipo de mensaje',
        this.element('div', { id: 'messageTopicSelector' }, 
            this.getMessageTopicItems()
        ),
        $('backTo')
    );
}

Beastx.MessageManager.prototype.onTopicSelect = function(selectedTopicObject) {
    var value = '###' + selectedTopicObject.category + '-' + selectedTopicObject.id + '###';
    this.subjectInput.value = value;
}

Beastx.MessageManager.prototype.getMessageTopicItems = function() {
    var topicsElements = [];
    for (var category in this.messageTopics) {
        topicsElements.push(this.element('div', { 'class': 'subjectCategory' }, [ this.messageTopics[category].subject ]));
        var items = this.messageTopics[category].items;
        var itemsElements = [];
        for (var id in items) {
            var topic = New(Beastx.MessageManagerSubjectItem, [ category, id, items[id] ], { onselect: this.caller('onTopicSelect') })
            itemsElements.push(
                this.element('li', { 'class': 'item' }, [ topic.widget ])
            );
        }
        topicsElements.push(this.element('ul', { 'class': 'categoryItems' }, itemsElements));
    }
    return topicsElements;
}

Beastx.MessageManager.prototype.parseMessages = function() {
    this.messagesContainer = $$('#messages tbody')[0];    
    var entries = $$('tr.entry',this.messagesContainer);
    var msgs = $$('tr.text td.msgText', this.messagesContainer);
    for (var i = 0; i < msgs.length; ++i) {
        if (!VAR.inArray(this.ikariamKnownSubjects, entries[i].childNodes[7].childNodes[0].nodeValue)) {
            var msgText = msgs[i].childNodes[1].textContent.trim();
            var msgFirstLine = msgText.match(/(.+)/)[0];
            var messageVars = msgFirstLine.match(/###(.*)###/);
            if (messageVars) {
                var category = messageVars[1].split('-')[0];
                var id = messageVars[1].split('-')[1];
                var selectedTopic = this.messageTopics[category].items[id];
                DOM.removeAllChildNodes(entries[i].childNodes[7]);
                DOM.appendChildNodes(entries[i].childNodes[7], [
                    this.element('img', { style: { marginRight:  '0.5em' }, src: selectedTopic.icon }),
                    this.element('strong', { style: { color:  selectedTopic.color }}, [ this.messageTopics[category].subject + ': ' + selectedTopic.subject ])
                ]);
                msgs[i].childNodes[1].innerHTML = msgs[i].childNodes[1].innerHTML.replace(msgFirstLine, '');
            } else {
                entries[i].childNodes[7].childNodes[0].nodeValue = VAR.cutText(msgFirstLine, 90, true);
            }
        }
        if (Beastx.Config.options.MessageManager.convertUrls) {
            msgs[i].childNodes[1].innerHTML = VAR.replaceURLWithHTMLLinks(msgs[i].childNodes[1].innerHTML.trim());
        }
        if (Beastx.Config.options.MessageManager.convertSmyles) {
            entries[i].childNodes[7].innerHTML = this.convertSmyles(entries[i].childNodes[7].innerHTML.trim());
            msgs[i].childNodes[1].innerHTML = this.convertSmyles(msgs[i].childNodes[1].innerHTML.trim());
        }
    }
}

Beastx.MessageManager.prototype.convertSmyles = function(text) {
    var smileys = {
        ":\\)"       : 'laugh',
        ":\\("       : 'frown',
        ";\\("      : 'wink',
        ":D"        : 'biggrin',
        ":\\|"       : 'dong',
        ":P"         : 'tongue',
        ":s"         : 's',
        ":S"        : 's',
        "&gt;P"         : 'tongue'
    };
    var regex = {};
    for (key in smileys) {
        regex[key] = new RegExp(key, 'g');
    }
    
    for (key in smileys) {
        text = text.replace(regex[key], '<img src="http://7moreg.beastx.com.ar/tools/userScripts/0.7/images/' + smileys[key] + '.gif" />');
    }
    return text;
}





Beastx.MessageManagerSubjectItem = function() {};
    
Beastx.MessageManagerSubjectItem.prototype.init = function(category, id, options) {
    this.category = category;
    this.id = id;
    this.subject = options.subject;
    this.color = options.color;
    this.icon = options.icon;
    this.updateUI();
}

Beastx.MessageManagerSubjectItem.prototype.updateUI = function() {
    this.widget = this.element('a',
        {
            href: '#',
            onclick: this.caller('onClick')
        },
        [
            Beastx.Config.options.MessageManager.showIcons ? this.element('img', { src: this.icon }) : null,
            this.subject
        ]
    );
}

Beastx.MessageManagerSubjectItem.prototype.onClick = function(event) {
    DOM.cancelEvent(event);
    this.dispatchEvent(
        'select', {
            category: this.category,
            id: this.id
        });
}





Beastx.MessageManager.prototype.getDefaultConfigs = function() {
    Beastx.Config.options.MessageManager = {
        enabled: true,
        showIcons: true,
        useLocalDate: true,
        convertUrls: true,
        convertSmyles: true,
        showAmmount: 20
    }
}

Beastx.MessageManager.prototype.getConfigs = function() {
    return {
        showIcons: this.showIconsCheckbox.checked,
        useLocalDate: this.useLocalDateCheckbox.checked,
        showAmmount: this.showAmmountCombo.value,
        convertUrls: this.convertUrlsCheckbox.checked,
        convertSmyles: this.convertSmylesCheckbox.checked
    };
}

Beastx.MessageManager.prototype.getOptionBox = function() {
    this.showIconsCheckbox = this.checkbox('showIcons', Beastx.Config.options.MessageManager.showIcons);
    this.useLocalDateCheckbox = this.checkbox('useLocalDate', Beastx.Config.options.MessageManager.useLocalDate);
    this.showAmmountCombo = this.combo(
        'showAmmount',
        [
            { text: '10', value: 10 },
            { text: '20', value: 20 },
            { text: '30', value: 30 },
            { text: '50', value: 50 }
        ],
        Beastx.Config.options.MessageManager.showAmmount
    );
    this.convertUrlsCheckbox = this.checkbox('convertUrls', Beastx.Config.options.MessageManager.convertUrls);
    this.convertSmylesCheckbox = this.checkbox('convertSmyles', Beastx.Config.options.MessageManager.convertSmyles);
    return this.keyValueTable([
        { label: 'Mostrar Iconos en los auntos', value: this.showIconsCheckbox },
        { label: 'Usar fecha local', value: this.useLocalDateCheckbox },
        { label: 'Convertir las urls en los mensajes en links que se pueda hacer click', value: this.convertUrlsCheckbox },
        { label: 'Convertir los Smyles de texto en graficos (por ejemplo :D)', value: this.convertSmylesCheckbox },
        { label: 'Mensages por pagina', value: this.showAmmountCombo }
    ]);
}

Beastx.registerModule(
    'Message Manager',
    'Este modulo nos cambia todo el sistema de mensajes de ikariam, para poder enviar mensajes con asuntos prestablesidos y con esto lograr que la informacion sirva mucho mas..'
);