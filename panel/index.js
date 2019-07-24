var Fs = require('fs');

importModule("https://cdn.jsdelivr.net/npm/rete@1.4.1-rc.1/build/rete.min.js");
importModule("https://cdn.jsdelivr.net/npm/rete-vue-render-plugin@0.4.0/build/vue-render-plugin.min.js");
importModule("https://cdn.jsdelivr.net/npm/rete-connection-plugin@0.8.1/build/connection-plugin.min.js");

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({

    style: Fs.readFileSync(Editor.url('packages://d-editor/panel/index.css', 'utf8')),

    template: Fs.readFileSync(Editor.url('packages://d-editor/panel/index.html', 'utf8')),

    // element and variable binding
    $: {
        btn: '#btn',
        label: '#label',
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        this.$btn.addEventListener('confirm', () => {
            Editor.Ipc.sendToMain('d-editor:clicked');

            var numSocket = new Rete.Socket('Number value');

            const container = document.querySelector('#rete');
            const editor = new Rete.NodeEditor('demo@0.1.0', container);

            Editor.log(numSocket);

        });
    },

    // register your ipc messages here
    messages: {
        'd-editor:hello' (event) {
            this.$label.innerText = 'Hello!';
        }
    }
});

function importModule(url) {
    var new_element = document.createElement("script");
    new_element.setAttribute("type", "text/javascript");
    new_element.setAttribute("src", url);
    document.body.appendChild(new_element);
}