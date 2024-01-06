/**
 * SVG parsing with @thi.ng/umbrella
 *
 * based on:
 * https://github.com/thi-ng/umbrella/tree/develop/packages/sax#dom-style-tree-parsing-using-defmulti
 *
 * SVG file is exported from Adobe Illustrator.
 * there's 2 options to handle style - as style tag/element or style attribute (inline).
 * below assumes it is exported with inline style.
 */

import { DEFAULT, defmulti } from "@thi.ng/defmulti";
import { group, rect } from "@thi.ng/geom";
import { type IHiccupShape } from "@thi.ng/geom-api";
import { draw } from "@thi.ng/hiccup-canvas";
import { type ParseEvent, parse } from "@thi.ng/sax";
import {
  comp,
  filter,
  iterator,
  last,
  map,
  transduce,
} from "@thi.ng/transducers";
import type { Sketch, SketchProps, SketchSettings } from "ssam";
import { ssam } from "ssam";
import { isString } from "@thi.ng/checks";

const sketch = async ({ wrap, context: ctx }: SketchProps) => {
  // hot reloading
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const rawSvg = await fetch("graphic-style-attribute.svg");
  const svgText = await rawSvg.text();
  console.log({ svgText });

  const parseElement = defmulti((e) => e.tag);

  // returns iterator of parsed & filtered children of given element
  // (iterator is used to avoid extraneous copying at call sites)
  const parsedChildren = (e: ParseEvent) =>
    iterator(
      comp(
        map(parseElement),
        filter((e) => !!e),
      ),
      e.children!,
    );

  // this example only handles svg, g, rect elements, but add more as needed.
  // you can return any type of data you need. here, it uses @thi.ng/geom objects
  parseElement.add("svg", (e) => [...parsedChildren(e)]);
  parseElement.add("g", (e) => {
    const children = [...parsedChildren(e)] as unknown as IHiccupShape[];
    return group(e.attribs, children);
  });
  parseElement.add("rect", (e) => {
    const att = numericAttribs(e, "x", "y", "width", "height");

    return rect(
      [att.x, att.y],
      [att.width, att.height],
      transformCSS(e.attribs.style),
    );
  });
  // any SVG element that is not handled will be ignored.
  parseElement.add(DEFAULT, () => null);

  const parsed = parseElement(
    transduce(parse(), last(), svgText),
  ) as IHiccupShape[];
  console.log({ parsed });

  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `#FFF`;
    ctx.fillRect(0, 0, width, height);

    draw(ctx, group({ fill: `black` }, parsed));
  };
};

// there's a difference between SVG attribs and thi.ng attribs names
// add more as necessary
const toThingAttribs = (attribs: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(attribs).map(([k, v]) => {
      if (k === "stroke-width") {
        return ["weight", v];
      } else if (k === "opacity") {
        return ["alpha", v];
      }
      return [k, v];
    }),
  );
};

// https://github.com/thi-ng/umbrella/blob/be2f2ac1a68e43f5c70f0b8f314f4dc1d96b825f/examples/xml-converter/src/convert.ts
// transforms string of CSS properties into a plain object
const transformCSS = (css: string) =>
  css.split(";").reduce((acc: any, p) => {
    const [k, v] = p.split(":");
    v != null && (acc[k.trim()] = parseAttrib([k, v.trim()])[1]);
    return toThingAttribs(acc);
  }, {});

// takes attrib key-value pair and attempts to coerce / transform its
// value. returns updated pair.
const parseAttrib = (attrib: string[]) => {
  let [k, v] = attrib;
  if (isString(v)) {
    v = v.replace(/[\n\r]+\s*/g, " ");
    return k === "style"
      ? [k, transformCSS(v)]
      : v === "true"
        ? [k, true]
        : v === "false"
          ? [k, false]
          : [k, /^[0-9.e+-]+$/.test(v) ? parseFloat(v) : v];
  }
  return attrib;
};

// coerces given attribute IDs into numeric values and
// keeps all other attribs
const numericAttribs = (e: ParseEvent, ...ids: string[]) =>
  ids.reduce(
    (acc, id) => (
      ((acc[id] as unknown as number) = parseFloat(e.attribs![id])), acc
    ),
    {
      ...e.attribs,
    },
  ) as unknown as { [key: string]: number };

const settings: SketchSettings = {
  dimensions: [800, 800],
  pixelRatio: 1,
  animate: false,
  filename: import.meta.url?.split("/").pop()?.split(".")[0] || undefined,
};

ssam(sketch as Sketch, settings);
