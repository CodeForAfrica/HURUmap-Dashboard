import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import HurumapCard from '@codeforafrica/hurumap-ui/core/Card';
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import FlourishChart from '../FlourishBlock/Chart';
import HURUmapChart from '../HURUmapBlock/Chart';

import config from '../config';

import Theme from '../Theme';
import propTypes from '../propTypes';
import { shareIndicator } from './utils';

function Card({ parentEl, postType, postId }) {
  const [post, setPost] = useState();
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/wp/v2/${postType}/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postType, postId]);

  return (
    <HurumapCard
      fullWidth
      onExpand={expanded => {
        // eslint-disable-next-line no-param-reassign
        parentEl.style.width = !expanded
          ? parentEl.getAttribute('data-width')
          : '100%';

        parentEl.firstChild.scrollIntoView();
      }}
      post={
        post && {
          title: post.title.rendered,
          content: post.content.rendered
        }
      }
    />
  );
}

Card.propTypes = {
  postId: propTypes.string.isRequired,
  postType: propTypes.string.isRequired,
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired
};

function Flourish({
  title,
  description,
  chartId,
  showInsight,
  insightSummary,
  insightTitle,
  dataLinkTitle,
  analysisCountry,
  dataGeoId,
  analysisLinkTitle
}) {
  return (
    <FlourishChart
      title={title}
      chartId={chartId}
      dataGeoId={dataGeoId}
      description={description}
      showInsight={showInsight}
      insightSummary={insightSummary}
      insightTitle={insightTitle}
      dataLinkTitle={dataLinkTitle}
      analysisCountry={analysisCountry}
      analysisLinkTitle={analysisLinkTitle}
      // eslint-disable-next-line react/jsx-no-bind
      handleShare={shareIndicator.bind(null, chartId)}
    />
  );
}

Flourish.propTypes = {
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired,
  chartId: propTypes.string.isRequired,
  title: propTypes.string.isRequired,
  description: propTypes.string.isRequired,
  showInsight: propTypes.bool.isRequired,
  insightSummary: propTypes.string.isRequired,
  insightTitle: propTypes.string.isRequired,
  analysisCountry: propTypes.string.isRequired,
  analysisLinkTitle: propTypes.string.isRequired,
  dataLinkTitle: propTypes.string.isRequired,
  dataGeoId: propTypes.string.isRequired
};

function HURUmap({
  chartWidth,
  chartId,
  geoId,
  showInsight,
  showStatVisual,
  insightSummary,
  insightTitle,
  analysisCountry,
  analysisLinkTitle,
  dataLinkTitle,
  dataGeoId
}) {
  const [response, setResponse] = useState();
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/hurumap-data/charts/${chartId}`)
      .then(res => res.json())
      .then(setResponse);
  }, [chartId]);
  return (
    <HURUmapChart
      geoId={geoId}
      chartId={chartId}
      chartWidth={chartWidth}
      dataGeoId={dataGeoId}
      showInsight={showInsight}
      insightSummary={insightSummary}
      insightTitle={insightTitle}
      showStatVisual={showStatVisual}
      dataLinkTitle={dataLinkTitle}
      analysisCountry={analysisCountry}
      analysisLinkTitle={analysisLinkTitle}
      // eslint-disable-next-line react/jsx-no-bind
      handleShare={shareIndicator.bind(null, chartId)}
      chart={
        response &&
        response.hurumap && {
          ...response.hurumap,
          visual: {
            ...JSON.parse(response.hurumap.visual),
            queryAlias: 'viz'
          },
          stat: {
            ...JSON.parse(response.hurumap.stat),
            queryAlias: 'viz'
          },
          source: JSON.parse(response.hurumap.source)
        }
      }
    />
  );
}

HURUmap.propTypes = {
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired,
  chartWidth: propTypes.string.isRequired,
  chartId: propTypes.string.isRequired,
  geoId: propTypes.string.isRequired,
  showInsight: propTypes.bool.isRequired,
  showStatVisual: propTypes.bool.isRequired,
  insightSummary: propTypes.string.isRequired,
  insightTitle: propTypes.string.isRequired,
  analysisCountry: propTypes.string.isRequired,
  analysisLinkTitle: propTypes.string.isRequired,
  dataLinkTitle: propTypes.string.isRequired,
  dataGeoId: propTypes.string.isRequired
};

function StylesWrapper({ children }) {
  useEffect(() => {
    /**
     * Patch fix
     * The overcome duplicated styles
     * TODO: Remove
     */
    const els = Array.from(document.getElementsByTagName('style'));
    const classes = els.map(el => el.getAttribute('data-meta'));
    els.reverse().forEach(el => {
      const meta = el.getAttribute('data-meta');
      if (
        meta &&
        meta !== 'MuiBox' &&
        meta !== 'makeStyles' &&
        classes.filter(c => c === meta).length > 1
      ) {
        classes.splice(classes.findIndex(c => c === meta), 1);
        el.remove();
      }
    });
  }, []);
  return <>{children}</>;
}

StylesWrapper.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node,
    propTypes.arrayOf(propTypes.node)
  ]).isRequired
};

window.onload = () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  const generateClassName = createGenerateClassName({
    productionPrefix: 'hurumap-ui-block-jss'
  });
  const client = new ApolloClient({
    uri: 'https://graphql.takwimu.africa/graphql'
  });

  ReactDOM.render(
    <StylesProvider generateClassName={generateClassName}>
      <MuiThemeProvider theme={window.Theme || Theme}>
        <StylesWrapper>
          {Array.from(document.querySelectorAll('div[id^=hurumap-card]')).map(
            el =>
              ReactDOM.createPortal(
                <Card
                  parentEl={el}
                  postId={el.getAttribute('data-post-id')}
                  postType={el.getAttribute('data-post-type')}
                />,
                el
              )
          )}
          {Array.from(
            document.querySelectorAll('div[id^=indicator-flourish]')
          ).map(el =>
            ReactDOM.createPortal(
              <Flourish
                parentEl={el}
                chartId={el.getAttribute('data-chart-id')}
                title={el.getAttribute('data-chart-title')}
                description={el.getAttribute('data-chart-description')}
                showInsight={el.getAttribute('data-show-insight') === 'true'}
                insightTitle={el.getAttribute('data-insight-title')}
                insightSummary={el.getAttribute('data-insight-summary')}
                dataLintTitle={el.getAttribute('data-data-link-title')}
                analysisCountry={el.getAttribute('data-analysis-country')}
                analysisLinkTitle={el.getAttribute('data-analysis-link-title')}
                dataGeoId={el.getAttribute('data-data-geo-id')}
              />,
              el
            )
          )}
          {document.querySelectorAll('div[id^=indicator-hurumap]') && (
            <ApolloProvider client={client}>
              {Array.from(
                document.querySelectorAll('div[id^=indicator-hurumap]')
              ).map(el =>
                ReactDOM.createPortal(
                  <HURUmap
                    parentEl={el}
                    chartId={el.getAttribute('data-chart-id')}
                    geoId={el.getAttribute('data-geo-type')}
                    showInsight={
                      el.getAttribute('data-show-insight') === 'true'
                    }
                    showStatVisual={el.getAttribute('data-show-statvisual')}
                    insightTitle={el.getAttribute('data-insight-title')}
                    insightSummary={el.getAttribute('data-insight-summary')}
                    dataLinkTitle={el.getAttribute('data-data-link-title')}
                    analysisCountry={el.getAttribute('data-analysis-country')}
                    analysisLinkTitle={el.getAttribute(
                      'data-analysis-link-title'
                    )}
                    dataGeoId={el.getAttribute('data-data-geoId')}
                    chartWidth={el.getAttribute('data-width')}
                  />,
                  el
                )
              )}
            </ApolloProvider>
          )}
        </StylesWrapper>
      </MuiThemeProvider>
    </StylesProvider>,
    root
  );
};