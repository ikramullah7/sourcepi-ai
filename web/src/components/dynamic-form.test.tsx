import { FormFieldType, generateSchema, RenderField } from './dynamic-form';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('generateSchema', () => {
  it('validates nested sibling fields and deeply nested required fields', () => {
    const schema = generateSchema([
      {
        name: 'provider.credentials.key',
        label: 'Key',
        type: FormFieldType.Text,
        required: true,
      },
      {
        name: 'provider.credentials.label',
        label: 'Label',
        type: FormFieldType.Text,
      },
      {
        name: 'provider.enabled',
        label: 'Enabled',
        type: FormFieldType.Switch,
      },
    ]);
    expect(
      schema.safeParse({
        provider: {
          credentials: { key: 'secret', label: 'Work' },
          enabled: true,
        },
      }).success,
    ).toBe(true);
    const invalid = schema.safeParse({
      provider: { credentials: { key: '', label: 'Work' }, enabled: true },
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0].path).toEqual([
        'provider',
        'credentials',
        'key',
      ]);
    }
  });
});

function CustomFieldForm({ onRead }: { onRead: (value: string) => void }) {
  const form = useForm({ defaultValues: { token: 'initial' } });
  const handleRead = () => onRead(form.getValues('token'));
  return (
    <FormProvider {...form}>
      <RenderField
        field={{
          name: 'token',
          label: 'Token',
          type: FormFieldType.Custom,
          hideLabel: true,
          render: (field) => <input aria-label="Token" {...field} />,
        }}
      />
      <button onClick={handleRead}>Read value</button>
    </FormProvider>
  );
}

it('binds hidden-label custom fields to form state', () => {
  const onRead = jest.fn();
  render(<CustomFieldForm onRead={onRead} />);
  expect(screen.getByRole('textbox', { name: 'Token' })).toHaveValue('initial');
  fireEvent.change(screen.getByRole('textbox', { name: 'Token' }), {
    target: { value: 'updated' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Read value' }));
  expect(onRead).toHaveBeenCalledWith('updated');
});
