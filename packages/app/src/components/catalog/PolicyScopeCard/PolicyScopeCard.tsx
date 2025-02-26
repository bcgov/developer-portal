import { InfoCard } from '@backstage/core-components';
import React, { useMemo } from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryGroup,
  VictoryStack,
  VictoryLegend,
} from 'victory';
import { Policy } from '@internal/plugin-policy-common';
import { useEntity } from '@backstage/plugin-catalog-react';
import { DateTime } from 'luxon';

export const PolicyScopeCard = () => {
  const { entity } = useEntity<Policy>();

  const data = entity.spec.scope;

  const { total, affected } = useMemo(() => {
    return {
      total: data.map(d => ({
        x: DateTime.fromFormat(d.date, 'yyyy-LL').monthShort,
        y: d.total,
      })),
      affected: data.map(d => ({
        x: DateTime.fromFormat(d.date, 'yyyy-LL').monthShort,
        y: Math.round(Math.random() * d.total),
      })),
    };
  }, [data]);
  return (
    <InfoCard title="Scope" subheader="Total number vs affected overtime">
      <VictoryChart theme={VictoryTheme.clean}>
        <VictoryLegend
          x={125}
          y={0}
          data={[
            {
              name: 'Affected',
              symbol: { fill: 'teal' },
            },
            {
              name: 'Total',
              symbol: { fill: 'blue' },
            },
          ]}
        />
        <VictoryStack>
          <VictoryLine
            data={affected}
            interpolation="basis"
            style={{ data: { stroke: 'teal' } }}
          />
          <VictoryLine
            data={total}
            style={{ data: { stroke: 'blue' } }}
            interpolation="basis"
          />
        </VictoryStack>
      </VictoryChart>
    </InfoCard>
  );
};
