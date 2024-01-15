import React, { ErrorInfo, ReactNode } from 'react';
import { View } from 'react-native';
import { AText } from './ALibrary';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <View>
          <AText>Something went wrong!</AText>
          <AText>{error?.message}</AText>
          <AText>{errorInfo?.componentStack}</AText>
        </View>
      );
    }

    return children as ReactNode;
  }
}

export default ErrorBoundary;
