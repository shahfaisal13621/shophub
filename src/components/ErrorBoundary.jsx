import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ShopHub page crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: "50vh" }}>
          <h1 className="h4 mb-3">This page hit an unexpected error.</h1>
          <p className="text-muted mb-4" style={{ maxWidth: 420 }}>
            Your cart and wishlist are safe. Use the navigation above, or go back to the home page.
          </p>
          <a href="/" className="btn btn-primary btn-glow">Back to home</a>
        </div>
      );
    }

    return this.props.children;
  }
}