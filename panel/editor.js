Editor.polymerPanel('d-editor.preview', {
    listeners: {
        'keydown': '_onKeyDown',
    },

    properties: {
        scale: {
            type: Number,
            value: 1.0,
        },
    },

    ready: function() {

    },

    _onKeyDown: function(event) {
        event.stopPropagation();

        if (Editor.KeyCode(event.which) === 'space') {

        }
    },
});

const numSocket = new Rete.Socket('Number value');

var VueNumControl = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: '<input type="number" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointermove.stop=""/>',
    data() {
        return {
            value: 0,
        }
    },
    methods: {
        change(e) {
            this.value = +e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}

class NumControl extends Rete.Control {

    constructor(emitter, key, readonly) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}

class NumComponent extends Rete.Component {

    constructor() {
        super("Number");
    }

    builder(node) {
        var out1 = new Rete.Output('num', "Number", numSocket);

        return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['num'] = node.data.num;
    }
}

class AddComponent extends Rete.Component {
    constructor() {
        super("Add");
    }

    builder(node) {
        var inp1 = new Rete.Input('num', "Number", numSocket);
        var inp2 = new Rete.Input('num2', "Number2", numSocket);
        var out = new Rete.Output('num', "Number", numSocket);

        inp1.addControl(new NumControl(this.editor, 'num'))
        inp2.addControl(new NumControl(this.editor, 'num2'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs['num'].length ? inputs['num'][0] : node.data.num1;
        var n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
        var sum = n1 + n2;

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
        outputs['num'] = sum;
    }
}

function init() {
    (async() => {
        var container = document.querySelector('#rete');
        var components = [new NumComponent(), new AddComponent()];

        var editor = new Rete.NodeEditor('demo@0.1.0', container);
        editor.use(ConnectionPlugin.default);
        editor.use(VueRenderPlugin.default);
        editor.use(ContextMenuPlugin.default);
        editor.use(AreaPlugin);
        editor.use(CommentPlugin.default);
        editor.use(HistoryPlugin);
        editor.use(ConnectionMasteryPlugin.default);

        var engine = new Rete.Engine('demo@0.1.0');

        components.map(c => {
            editor.register(c);
            engine.register(c);
        });

        var n1 = await components[0].createNode({ num: 2 });
        var n2 = await components[0].createNode({ num: 0 });
        var add = await components[1].createNode();

        n1.position = [80, 200];
        n2.position = [80, 400];
        add.position = [500, 240];


        editor.addNode(n1);
        editor.addNode(n2);
        editor.addNode(add);

        editor.connect(n1.outputs.get('num'), add.inputs.get('num'));
        editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));


        editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async() => {
            console.log('process');
            await engine.abort();
            await engine.process(editor.toJSON());
        });

        editor.view.resize();
        AreaPlugin.zoomAt(editor);
        editor.trigger('process');
    })();
}

//延迟到下一次Update再执行，不知道为何，立刻执行无货获取document节点内容
setTimeout(init, 0);