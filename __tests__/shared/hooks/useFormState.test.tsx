import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DefaultValues, Resolver } from 'react-hook-form';

import { useFormState } from '@/shared/hooks';

type TestFormValues = {
  name?: string | null;
  age?: number | null;
};

const TestComponent = ({
  onCloseModal,
  resolver,
  initialValues = { name: null, age: null },
}: {
  onCloseModal: () => void;
  resolver?: Resolver<TestFormValues>;
  initialValues?: TestFormValues;
}) => {
  const { formState, onReset } = useFormState<TestFormValues>({
    initialValues,
    onCloseModal,
    resolver,
  });

  const { register, handleSubmit, formState: state } = formState;

  const onSubmit = jest.fn();

  return (
    <form data-testid='form' onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: 'Name is required' })} placeholder='Name' />
      {state.errors.name && <p role='alert'>{state.errors.name.message}</p>}

      <button type='submit'>Submit</button>
      <button type='button' onClick={onReset}>
        Reset
      </button>
    </form>
  );
};

describe('useFormState', () => {
  const mockFormInitialValues = { name: 'John', age: 30 } as DefaultValues<TestFormValues>;
  const mockOnCloseModal = jest.fn();

  it('shows required error on empty submit', async () => {
    render(<TestComponent onCloseModal={mockOnCloseModal} />);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
    });
  });

  it('resets form and calls onCloseModal', async () => {
    render(<TestComponent initialValues={mockFormInitialValues} onCloseModal={mockOnCloseModal} />);

    const input = screen.getByPlaceholderText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Jane' } });

    expect(input.value).toBe('Jane');

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(input.value).toBe('John');
    });

    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it('shows resolver error when resolver is passed', async () => {
    const mockResolver: Resolver<TestFormValues> = async () => ({
      values: {},
      errors: {
        name: {
          type: 'custom',
          message: 'Resolver says name required',
        },
      },
    });

    render(<TestComponent resolver={mockResolver} onCloseModal={mockOnCloseModal} />);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Resolver says name required');
    });
  });
});
