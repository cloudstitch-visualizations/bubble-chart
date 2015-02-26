/*
 * Treesheet
 * ---------
 * 
 * This file enables your Cloudstitch app to be injected into 
 * a page as a widget. To do so, simply include cloudstitch.js 
 * in the web page HEAD: 
 * 
 *   <script src="http://cloudstitch.io/release/cloudstitch.js></script>
 * 
 * And then invoke the widget like this:
 *
 *   <div widget="visualizations/bubble-chart"></div>
 *
 */

@gsheet bubbleChartDatasource http://cloudstitch.io/visualizations/bubble-chart/datasource/bubbleChartDatasource;
@html bubble-chart //apps.cloudstitch.io/visualizations/bubble-chart/index.html;
@css relative(bubble-chart.css);
@js relative(d3.min.js);
@js relative(bubble-chart.js);

body|*[widget="visualizations/bubble-chart"] {"after": "bubbleChartWidget_PreInit"} :graft bubble-chart|#bubble-chart;
