import React, { useMemo } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { ChartFactory } from '@hurumap-ui/charts';
import { ChartContainer, useProfileLoader } from '@hurumap-ui/core';
import propTypes from './propTypes';

function HURUmapChart({
  geoId,
  chartId,
  charts,
  chart: propChart,
  embedCode,
  handleShare,
  useLoader,
  ...props
}) {
  const chart = useMemo(
    () => propChart || charts.find(c => `${c.id}` === chartId),
    [propChart, charts, chartId]
  );

  const visuals = useMemo(() => (chart ? [chart.visual] : []), [chart]);

  const { profiles, chartData } = useLoader({ geoId, visuals });

  const source = useMemo(() => {
    const { isLoading, profileVisualsData } = chartData;

    if (!chart || isLoading) {
      return null;
    }

    const {
      visual: { queryAlias }
    } = chart;

    const sourceResult = profileVisualsData[`${queryAlias}Source`];
    return sourceResult && sourceResult.nodes && sourceResult.nodes.length
      ? sourceResult.nodes[0]
      : null;
  }, [chart, chartData]);

  if (
    !chart ||
    (!chartData.isLoading &&
      chartData.profileVisualsData[chart.visual.queryAlias] &&
      chartData.profileVisualsData[chart.visual.queryAlias].nodes &&
      chartData.profileVisualsData[chart.visual.queryAlias].nodes.length === 0)
  ) {
    return (
      <Grid container justify="center" alignItems="center">
        <Typography>Data is missing for visualizing this chart.</Typography>
      </Grid>
    );
  }

  const rawData = !chartData.isLoading
    ? chartData.profileVisualsData[chart.visual.queryAlias].nodes
    : [];

  return (
    <ChartContainer
      key={chart.id}
      title={chart.title}
      description={chart.description && chart.description[geoId]}
      loading={chartData.isLoading}
      sourceTitle={source && source.title}
      sourceLink={source && source.href}
      embedCode={embedCode}
      actions={{ handleShare }}
      dataTable={{
        tableTitle: (chart.visual.table || '').slice(3),
        groupByTitle: chart.visual.groupBy,
        dataLabelTitle: chart.visual.x,
        dataValueTitle: chart.visual.y,
        rawData
      }}
      {...props}
    >
      {!chartData.isLoading && (
        <ChartFactory
          profiles={profiles}
          definition={chart.visual}
          data={rawData}
        />
      )}
    </ChartContainer>
  );
}

HURUmapChart.propTypes = {
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.shape({
      queryAlias: propTypes.string,
      table: propTypes.string,
      groupBy: propTypes.string,
      x: propTypes.string,
      y: propTypes.string
    }),
    description: propTypes.shape({}),
    stat: propTypes.shape({
      queryAlias: propTypes.string
    }),
    queryAlias: propTypes.string
  }),
  charts: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      description: propTypes.shape({})
    })
  ),
  geoId: propTypes.string,
  chartId: propTypes.string,
  embedCode: propTypes.string,
  handleShare: propTypes.func,
  useLoader: propTypes.func
};

HURUmapChart.defaultProps = {
  chart: undefined,
  charts: [],
  geoId: undefined,
  chartId: undefined,
  embedCode: '',
  handleShare: () => {},
  useLoader: useProfileLoader
};

export default HURUmapChart;
