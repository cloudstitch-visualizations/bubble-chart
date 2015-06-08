/*
 * Treesheet
 * ---------
 * 
 * This file enables your Cloudstitch app to be injected into 
 * a page as a widget. To do so, simply include cloudstitch.js 
 * in the web page HEAD: 
 * 
 *   <script src="http://static.cloudstitch.io/cloudstitch.js></script>
 * 
 * And then invoke the widget like this:
 *
 *   <div widget="project-templates/bubble-chart-visualization"></div>
 *
 */

@gsheet bubbleChartSheet http://cloudstitch.io/project-templates/bubble-chart-visualization/datasource/bubbleChartSheet;
@html bubble-chart //apps.cloudstitch.io/project-templates/bubble-chart-visualization/widget.html;
@css relative(bubble-chart.css);
@js relative(d3.min.js);
@js relative(bubble-chart.js);

body|*[widget="project-templates/bubble-chart-visualization"] {"after": "bubbleChartWidget_PreInit"} :graft bubble-chart|#bubble-chart;
