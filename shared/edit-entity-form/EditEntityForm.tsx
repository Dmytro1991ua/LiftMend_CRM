import { useEffect } from 'react';

import { FieldValues, Form, Path, useFormContext } from 'react-hook-form';
import { CirclesWithBar } from 'react-loader-spinner';

import BaseAlert from '../base-alert/BaseAlert';
import QueryResponse from '../query-response';
import { ItemConfig } from '../types';

type EditEntityFormProps<T> = {
  formValues: T;
  fieldConfigs: ItemConfig[];
  loading: boolean;
  error?: string;
};

const EditEntityForm = <T extends FieldValues>({
  formValues,
  fieldConfigs,
  loading,
  error,
}: EditEntityFormProps<T>) => {
  const { setValue, clearErrors } = useFormContext<T>();

  useEffect(() => {
    Object.keys(formValues).forEach((key) => {
      setValue(key as Path<T>, formValues[key as keyof T]);
      clearErrors();
    });
  }, [formValues, setValue, clearErrors]);

  return (
    <Form className='grid grid-cols-6 gap-2'>
      <QueryResponse
        errorComponent={<BaseAlert description={error || ''} title='Failed to fetch form data' variant='destructive' />}
        isErrorOccurred={!!error}
        loading={loading}
        loadingComponent={
          <CirclesWithBar
            ariaLabel='loading-indicator'
            color='#2563eb'
            height={70}
            visible={true}
            width={70}
            wrapperClass='row-start-1 row-end-7 col-start-1 col-end-7 justify-center items-center'
          />
        }
      />
      {!loading && !error && (
        <>
          {fieldConfigs.map(({ id, label, className, content }) => (
            <div key={id} className={className}>
              <span className='block text-sm font-bold mb-2'>{label}</span>
              {content}
            </div>
          ))}
        </>
      )}
    </Form>
  );
};

export default EditEntityForm;
