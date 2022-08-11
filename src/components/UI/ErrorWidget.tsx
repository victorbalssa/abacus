import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from 'native-base';
import { RootState } from '../../store';
import ToastAlert from './ToastAlert';

const ErrorWidget: FC = () => {
  const toast = useToast();
  const { error } = useSelector((state: RootState) => state.loading.global);

  useEffect(() => {
    if (error && (error as Error).message) {
      toast.show({
        render: ({ id }) => (
          <ToastAlert
            onClose={() => toast.close(id)}
            title="Something went wrong"
            status="error"
            variant="solid"
            description={(error as Error).message}
          />
        ),
      });
    }
  }, [error]);

  return <></>;
};

export default ErrorWidget;
