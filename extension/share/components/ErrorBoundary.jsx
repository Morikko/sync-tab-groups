import React from 'react'
import LogManager from '../../background/error/logmanager'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // Always sent error, let the back decides if to save
    LogManager.error(error, {info}, {enable: true});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
        ? this.props.fallback
        : <div>Error occured</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary