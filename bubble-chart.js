function bubbleChartWidget_Init(elem, treeName) {
  // Load data
  if (typeof tree == 'undefined') {
    treeName = 'bubbleChartDatasource';
  }
  if (CTS && CTS.engine && CTS.engine.forrest) {
    try {
      var data = bubbleChartWidget_Data(treeName);
      var settings = bubbleChartWidget_Settings(treeName);
      bubbleChartWidget_Draw(elem[0], data, settings);
    } catch(e) {
      console.log(e);
    }
  }
}

function bubbleChartWidget_Settings(treeName) {
  var settings = CTS(treeName + "|Settings!rows").nodes[0].toJson()[0];
  settings.Radius = parseInt(settings.Radius);
  return settings;
}

function bubbleChartWidget_Data(treeName) {
  var rows = CTS(treeName + "|Data!rows").nodes[0].toJson();
  var root = [];
  var byName = {};
  var unnamed = 1;

  for (var i = 0; i < rows.length; i++) {
    var parent = rows[i].ParentCategory || null;
    var name = rows[i].ItemOrCategory;
    if (!name) {
      name = ('unnamed-node-' + unnamed);
      unnamed += 1;
    }
    var size = rows[i].OptionalValue || 0;
    
    try {
      size = parseFloat(size);
    } catch(e) {
      size = 0;
    }

    var node = {
      parent: parent,
      name: name,
      size: size
    };

    root.push(node);
    byName[node.name] = node;
  }

  // Now we add all parents that weren't nodes.
  var root2 = [];

  for (var i = 0; i < root.length; i++) {
    var node = root[i];
    root2.push(node);
    if ((node.parent) && (! (node.parent in byName))) {
      var newNode = {
        name: node.parent,
        value: 0,
        parent: null
      }
      root2.push(newNode);
      byName[newNode.name] = newNode;
    }
  }

  // OK. Now we've got every node. We can start wiring up children to parents.
  var root3 = [];
  for (var i = 0; i < root2.length; i++) {
    var node = root2[i];
    if (node.parent) {
      if (! byName[node.parent].children) {
        byName[node.parent].children = [];
      }
      byName[node.parent].children.push(node);
    } else {
      // It's a true root!
      root3.push(node);
    }
  }

  // Now we consolidate into one top node.
  var ret;
  if (root3.length == 1) {
    ret = root3[0];
  } else {
    ret = {
      name: "All Nodes",
      children: root3
    }
  }
  
  ret.totalNodeCount = root.length;

  return ret;
}

function bubbleChartWidget_Draw(elem, data, settings) {
  format = d3.format(",d"),
  fill = d3.scale.category20c();

  var Radius = settings.Radius;
  var totalNodeCount = data.totalNodeCount;

  // Recompute new radius
  var bubble = d3.layout.pack()
                 .sort(null)
                 .size([Radius, Radius])
                 .padding(1.5);

  var vis = d3.select(elem).append("svg")
              .attr("width", settings.Radius)
              .attr("height", settings.Radius)
              .attr("class", "bubble bubble-chart-widget-svg");

  // var data = {"name": "flare"};

  // if ("children" in allData) {
  //   data["children"] = allData.children;
  // }
  function classes(root) {
    var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size});
      }

      recurse(null, root);
      return {children: classes};
  }

  var node = vis.selectAll("g.node")
      .data(bubble.nodes(classes(data))
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return fill(d.packageName); });

  node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
}

function bubbleChartWidget_PreInit(ctsTarget, ctsSource, ctsRelation) {
  var widgetContainer = ctsTarget.value;
  // Need to wait for all the widget dependencies to load. This should be
  // a standard feature built in.
  var tryIt = function() {
    if ((typeof d3 != 'undefined') && (typeof window.bubbleChartWidget_Data != 'undefined')) {
      bubbleChartWidget_Init(widgetContainer);
    } else {
      setTimeout(tryIt, 100);
    }
  }
  tryIt();
}  



