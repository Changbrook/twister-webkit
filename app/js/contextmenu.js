'use strict';

/**
 * Context menu
 */

window.addEventListener('init', function () {

    var menu = new nw.Menu(),
        contextURL = '',
        itemOpenLink = new nw.MenuItem({
            label: __('Open in browser'),
            click: function () {
                nw.Shell.openExternal(contextURL);
            }
        }),
        itemCopy = new nw.MenuItem({
            label: __('Copy'),
            click: function () {
                window.getIframeDocument().execCommand("copy");
            }
        }),
        itemCopyLink = new nw.MenuItem({
            label: __('Copy link'),
            click: function () {
                var clipboard = nw.Clipboard.get();
                clipboard.set(contextURL, 'text');
            }
        }),
        itemPaste = new nw.MenuItem({
            label: __('Paste'),
            click: function () {
                window.getIframeDocument().execCommand("paste");
            }
        }),
        itemReload = new nw.MenuItem({
            label: __('Reload'),
            click: function () {
                setTimeout(window.reloadFrame, 0);
            }
        });

    menu.append(itemOpenLink);
    menu.append(itemCopy);
    menu.append(itemCopyLink);
    menu.append(itemPaste);
    menu.append(new nw.MenuItem({type: 'separator'}));
    menu.append(itemReload);

    function onContextMenu(event) {
        var el = event.target,
            bTextInput = (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA');

        // copy
        itemCopy.enabled = bTextInput || !window.getIframeDocument().getSelection().isCollapsed;
        // paste
        itemPaste.enabled = bTextInput && !!nw.Clipboard.get().get('text');

        // copy link
        while (!(/^(a|html)$/i).test(el.nodeName)) {
            el = el.parentNode;
        }
        contextURL = el.href || '';
        itemOpenLink.enabled = !!contextURL;
        itemCopyLink.enabled = !!contextURL;

        event.preventDefault();
        menu.popup(event.x, event.y);
        return false;
    }

    addEventListener('updateIframe', function () {
        var iframedoc = window.getIframeDocument();
        if (iframedoc) {
            iframedoc.addEventListener('contextmenu', onContextMenu, false);
        }
    });

});