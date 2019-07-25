Editor.polymerPanel('d-editor.preview', {});

function init() {
    let packageName = "d-editor";
    let LiteGraph = Editor.require('packages://' + packageName + '/node_modules/litegraph.js').LiteGraph;

    var graph = new LiteGraph.LGraph();

    var canvas = new LiteGraph.LGraphCanvas("#mycanvas", graph);

    var node_const = LiteGraph.createNode("basic/const");
    node_const.pos = [200, 200];
    graph.add(node_const);
    node_const.setValue(4.5);

    var node_watch = LiteGraph.createNode("basic/watch");
    node_watch.pos = [700, 200];
    graph.add(node_watch);

    node_const.connect(0, node_watch, 0);

    graph.start()
}

setTimeout(init, 0);