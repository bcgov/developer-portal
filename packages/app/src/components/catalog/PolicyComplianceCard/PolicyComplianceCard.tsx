import { InfoCard } from '@backstage/core-components';
import React, { useMemo } from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryBar,
  ForAxes,
  DomainTuple,
} from 'victory';
import { Policy } from '@internal/plugin-policy-common';
import { useEntity } from '@backstage/plugin-catalog-react';
import { DateTime } from 'luxon';
import { green, red } from '@material-ui/core/colors';

interface PolicyComplianceCardProps {}

export const PolicyComplianceCard = (props: PolicyComplianceCardProps) => {
  const { entity } = useEntity<Policy>();

  const data = entity.spec.compliance;

  const { pass, fail, domain } = useMemo(() => {
    const _fail = data.map(d => ({
      x: DateTime.fromFormat(d.date, 'yyyy-LL').monthShort,
      y: d.fail,
    }));
    const _pass = data.map(d => ({
      x: DateTime.fromFormat(d.date, 'yyyy-LL').monthShort,
      y: d.pass,
    }));
    const max = Math.max(..._fail.map(v => v.y), ..._pass.map(v => v.y));
    return {
      fail: _fail,
      pass: _pass,
      domain: { y: [0, max] } as ForAxes<DomainTuple>,
    };
  }, [data]);
  return (
    <InfoCard
      title="Compliance"
      subheader="Number of compliant components overtime"
    >
      <VictoryChart
        theme={VictoryTheme.clean}
        domain={domain}
        padding={{
          top: 30,
          bottom: 30,
          left: 40,
          right: 40,
        }}
      >
        <VictoryGroup offset={10} style={{ data: { width: 10 } }}>
          <VictoryBar data={fail} style={{ data: { fill: red['500'] } }} />
          <VictoryBar data={pass} style={{ data: { fill: green['500'] } }} />
        </VictoryGroup>
      </VictoryChart>
    </InfoCard>
  );
};
