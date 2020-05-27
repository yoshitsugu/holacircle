import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HierarchyCircularNode } from 'd3';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setFocus } from 'redux/modules/focusModule';
import { useGetRolesQuery } from 'generated/graphql';
import { setCircleFromGraphql } from 'redux/modules/circleModule';
import CircleViewData from '../models/CircleViewData';

const pack = (data: CircleViewData, width: number, height: number): HierarchyCircularNode<CircleViewData> =>
  d3.pack<CircleViewData>().size([width, height])(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => Number(b?.value) - Number(a?.value)),
  );

const colorRange = d3
  .scaleLinear<string, string>()
  .domain([0, 10])
  .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
  .interpolate(d3.interpolateHcl);

const color = (d: HierarchyCircularNode<CircleViewData>): string => {
  if (d.data.isLabel) {
    return 'none';
  }
  if (!d.data.isCircle) {
    if (d.data.members.length === 0) {
      return '#fff';
    }
    return colorRange(d.depth);
  }
  return colorRange(d.depth);
};

type ZoomView = [number, number, number];

const fontSize = (d: HierarchyCircularNode<CircleViewData>, k: number): number => {
  return Math.max(10, 10 + (2 * (d.r * k)) / (4 + 4 * d.depth));
};

function useZoomableChart(data: CircleViewData, width: number, height: number) {
  const view = useRef<ZoomView>([1, 1, 1]);
  const root = pack(data, width, height);
  const focus = useRef<d3.HierarchyCircularNode<CircleViewData>>(root);
  const dispatch = useDispatch();
  const d3Container = useRef<SVGSVGElement | null>(null);
  const svg = useRef<d3.Selection<SVGSVGElement, unknown, null, unknown> | null>(null);
  const node = useRef<d3.Selection<
    SVGCircleElement,
    HierarchyCircularNode<CircleViewData>,
    SVGElement,
    unknown
  > | null>(null);
  const fo = useRef<d3.Selection<
    SVGForeignObjectElement,
    HierarchyCircularNode<CircleViewData>,
    SVGGElement,
    unknown
  > | null>(null);

  const zoomTo = (v: ZoomView) => {
    const k = width / v[2];

    view.current = v;

    if (node.current) {
      node.current.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.current.attr('r', (d) => d.r * k);
    }
    if (fo.current) {
      fo.current
        .attr('x', (d) => (d.x - v[0]) * k - (d.r * k) / 1.4)
        .attr('y', (d) => (d.y - v[1]) * k - (d.r * k) / 1.4)
        .attr('width', (d) => d.r * k * 1.4)
        .attr('height', (d) => d.r * k * 1.4)
        .style('font-size', (d) => `${fontSize(d, k)}px`);
    }
  };

  const zoom = (d: HierarchyCircularNode<CircleViewData>) => {
    dispatch(setFocus(d.data.id));
    focus.current = d;
    if (!d.data.isCircle) {
      return;
    }
    if (svg.current && focus.current) {
      const fc = focus.current;
      svg.current
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween('zoom', () => {
          if (view) {
            const i = d3.interpolateZoom(view.current, [fc.x, fc.y, fc.r * 2]);
            return (t: number) => zoomTo(i(t));
          }
          return () => zoomTo([root.x, root.y, root.r * 2]);
        });
    }
    if (fo.current) {
      fo.current.style('opacity', () => {
        return d.parent?.parent === focus.current || d.parent === focus.current || d === focus.current ? 1 : 0;
      });
    }
  };

  const queryResult = useGetRolesQuery({
    variables: {},
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (d3Container.current && !svg.current) {
      const roleGraphql = queryResult.data?.role;
      if (roleGraphql) {
        dispatch(setCircleFromGraphql(roleGraphql));
      }
      svg.current = d3
        .select(d3Container.current)
        .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
        .style('display', 'block')
        .style('margin', '0 -14px')
        .style('background', 'white')
        .style('cursor', 'pointer')
        .on('click', () => zoom(root));

      node.current = svg.current
        .append('g')
        .selectAll<SVGCircleElement, CircleViewData>('circle')
        .data(root.descendants())
        .join('circle')
        .attr('title', (d) => (!d.data.isLabel || !d.data.isCircle ? d.data.name : ''))
        .attr('data-tippy-content', (d) => (!d.data.isLabel || !d.data.isCircle ? d.data.name : ''))
        .attr('fill', color)
        .on('mouseover', function mouseOver() {
          d3.select(this).attr('stroke', '#999');
        })
        .on('mouseout', function mouseOut() {
          d3.select<
            Element | d3.EnterElement | Document | Window | SVGCircleElement | null,
            HierarchyCircularNode<CircleViewData>
          >(this).attr('stroke', color);
        })
        .on('click', (d) => focus.current !== d && (zoom(d), d3.event.stopPropagation()));

      fo.current = svg.current
        .append('g')
        .selectAll<SVGForeignObjectElement, CircleViewData>('foreignObject')
        .data(root.descendants())
        .join('foreignObject')
        .attr('pointer-events', 'none')
        .filter((d) => d.data.isLabel || !d.data.isCircle)
        .attr('class', 'circle-name')
        .style('opacity', (d) => (d === root || d.parent === root || d.parent?.parent === root ? 1 : 0));

      fo.current
        .append('xhtml:div')
        .style('line-height', 1.2)
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('align-items', 'center')
        .html((d) => d.data.name);

      zoomTo([root.x, root.y, root.r * 2]);

      tippy('[data-tippy-content]');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, data, width, height]);

  return d3Container;
}

export default useZoomableChart;
