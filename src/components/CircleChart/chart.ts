import * as d3 from 'd3';
import { HierarchyData } from './index';
import { HierarchyCircularNode } from 'd3';

// https://observablehq.com/@d3/zoomable-circle-packing

export default (container: SVGElement, data: HierarchyData, width: number, height: number) => {
  let pack = (data: HierarchyData): HierarchyCircularNode<HierarchyData> =>
    d3.pack<HierarchyData>().size([width, height]).padding(3)(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => Number(b?.value) - Number(a?.value)),
    );

  let color = d3
    .scaleLinear<string, string>()
    .domain([0, 10])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  const root = pack(data);
  let focus = root;
  let view: [number, number, number];

  const svg = d3
    .select(container)
    .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
    .style('display', 'block')
    .style('margin', '0 -14px')
    .style('background', 'white')
    .style('cursor', 'pointer')
    .on('click', () => zoom(root));

  const nodeFill = (d: HierarchyCircularNode<HierarchyData>) => {
    return d.data.isLabel ? 'none' : d.children ? color(d.depth) : 'white';
  };

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(root.descendants())
    .join('circle')
    .attr('title', (d) => (d.data.isLabel ? d.data.name : ''))
    .attr('fill', (d) => nodeFill(d))
    .attr('pointer-events', (d) => (!d.children ? 'none' : null))
    .on('mouseover', function () {
      d3.select(this).attr('stroke', '#999');
    })
    .on('mouseout', function () {
      d3.select<
        Element | d3.EnterElement | Document | Window | SVGCircleElement | null,
        HierarchyCircularNode<HierarchyData>
      >(this).attr('stroke', (d) => color(d.depth));
    })
    .on('click', (d) => focus !== d && (zoom(d), d3.event.stopPropagation()));

  const fo = svg
    .append('g')
    .selectAll('foreignObject')
    .data(root.descendants())
    .join('foreignObject')
    .attr('pointer-events', 'none')
    .filter((d) => d.data.isLabel)
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', '200')
    .attr('width', '200')
    .attr('class', 'circle-name')
    .style('opacity', (d) => (d === root || d.parent === root || d.parent?.parent === root ? 1 : 0));

  fo.append('xhtml:div')
    .style('line-height', 1)
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')

    .html((d) => (d.data.isLabel ? d.data.name : ''));

  zoomTo([root.x, root.y, root.r * 2]);

  function zoomTo(v: [number, number, number]) {
    const k = width / v[2];

    view = v;

    node.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr('r', (d) => d.r * k);
    fo.attr('x', (d) => (d.x - v[0]) * k - (d.r * k) / 1.5)
      .attr('y', (d) => (d.y - v[1]) * k - (d.r * k) / 1.5)
      .attr('width', (d) => d.r * k * 1.5)
      .attr('height', (d) => d.r * k * 1.5)
      .attr('font-size', (d) => (d.r * k) / 4);
  }

  function zoom(d: HierarchyCircularNode<HierarchyData>) {
    focus = d;

    svg
      .transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween('zoom', () => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t: number) => zoomTo(i(t));
      });
    fo.style('opacity', (d) => {
      return d.parent?.parent === focus || d.parent == focus || d === focus ? 1 : 0;
    });
  }

  return svg.node();
};
