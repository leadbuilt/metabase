import d3 from "d3";
import type { Series as D3Series } from "d3-shape";
import {
  ContinuousDomain,
  ContinuousScaleType,
} from "metabase/visualizations/shared/types/scale";
import { Series } from "../types";

export const createYDomain = <TDatum>(
  data: TDatum[],
  series: Series<TDatum>[],
) => {
  // taking first series assuming all series have the same Y-axis values
  return data.map(datum => series[0].yAccessor(datum));
};

export const createXDomain = <TDatum>(
  data: TDatum[],
  series: Series<TDatum>[],
  additionalValues: number[],
  xScaleType: ContinuousScaleType,
): ContinuousDomain => {
  const allXValues = series.flatMap(
    series =>
      data
        .map(datum => series.xAccessor(datum))
        .filter(value => value != null) as number[],
  );
  const [min, max] = d3.extent([...allXValues, ...additionalValues]);

  if (xScaleType === "log") {
    return [1, Math.max(max, 1)];
  }

  return [Math.min(min, 0), Math.max(max, 0)];
};

export const createStackedXDomain = <TDatum>(
  stackedSeries: D3Series<TDatum, string>[],
  additionalValues: number[],
  xScaleType: ContinuousScaleType,
) => {
  const [min, max] = d3.extent([...stackedSeries.flat(2), ...additionalValues]);

  if (xScaleType === "log") {
    return [1, Math.max(max, 1)];
  }

  return [min, max];
};
