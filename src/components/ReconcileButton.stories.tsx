import React from 'react';
import { storiesOf } from '@storybook/react';
import ReconcileButton from "./ReconcileButton";
import { CompliancyCheckerService } from "../services/CompliancyCheckerService";
import { DummyAzDoService } from "../services/DummyAzDoService";

storiesOf('ReconcileButton', module)
  .add('default', () => (
    <ReconcileButton reconcilableItem={{
        reconcileUrl: '/mock-url',
          reconcileImpact: ['mock-impact'],
          compliancyCheckerService: new CompliancyCheckerService(new DummyAzDoService())
      }}/>
  ));
