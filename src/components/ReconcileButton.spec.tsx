import React from 'react';
import fetchMock from 'fetch-mock';
import { ReconcileButton } from "./ReconcileButton";
import { fireEvent, render, wait } from "react-testing-library";
import { DummyAzDoService } from "../services/DummyAzDoService";
import { CompliancyCheckerService } from "../services/CompliancyCheckerService";

describe('ReconcileButon', () => {
  it('should reconcile', async () => {
    const { debug, getByText, getAllByText, findByText } = render(<ReconcileButton reconcilableItem={{
      reconcileUrl: '/mock-url',
      reconcileImpact: ['mock-impact'],
      compliancyCheckerService: new CompliancyCheckerService(new DummyAzDoService())
    }}/>);

    const reconcileButton = getByText('Reconcile');
    fireEvent.click(reconcileButton);

    const reconcileButtons = getAllByText('Reconcile');
    expect(reconcileButtons).toHaveLength(2);

    fetchMock.get('*', 200);

    getByText('Confirm reconciliation');

    const dialogConfirmButton = reconcileButtons[1];
    fireEvent.click(dialogConfirmButton);

    wait(() => {
      expect(findByText('Confirm reconciliation')).toBeNull();
    });
  });

  it('should show a loading state while reconciling', async () => {});
  it('should show an error when reconciling failed', async () => {});
  it('should dismiss the dialog', async () => {});
});