jest.mock('@/components/model-tree-select', () => ({
  ModelTreeSelectFormField: () => null,
}));
jest.mock('@/components/message-history-window-size-item', () => ({
  MessageHistoryWindowSizeFormField: () => null,
}));
jest.mock('../../context', () => ({ useOwnerTenantId: () => undefined }));
jest.mock('../../hooks/use-form-values', () => ({
  useFormValues: () => ({ language: 'English', llm_id: 'model' }),
}));
jest.mock('../../hooks/use-watch-form-change', () => ({
  useWatchFormChange: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { render } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Operator } from '../../constant';
import { useWatchFormChange } from '../../hooks/use-watch-form-change';
import RewriteQuestionForm from './index';

it('owns its form and synchronizes it with the selected node', () => {
  const node = {
    id: 'rewrite:0',
    position: { x: 0, y: 0 },
    data: { label: Operator.RewriteQuestion, name: 'Rewrite', form: {} },
  };
  render(
    <TooltipProvider>
      <RewriteQuestionForm node={node} />
    </TooltipProvider>,
  );
  expect(useWatchFormChange).toHaveBeenCalledWith(
    node.id,
    expect.objectContaining({ control: expect.any(Object) }),
  );
});
