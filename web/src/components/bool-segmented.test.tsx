import { fireEvent, render, screen } from '@testing-library/react';
import { BoolSegmented } from './bool-segmented';

describe('BoolSegmented', () => {
  it('emits booleans when switching either direction', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <BoolSegmented value={false} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'True' }));
    expect(onChange).toHaveBeenLastCalledWith(true);

    rerender(<BoolSegmented value={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'False' }));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });
});
