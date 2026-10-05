import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "Unknown error",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("A_2_Z_Fashion Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-5">
          <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-black">
              A2Z
            </div>

            <h1 className="mt-4 text-xl font-black text-neutral-900 text-center">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm text-red-600 leading-6 break-words">
              {this.state.errorMessage}
            </p>

            <button
              onClick={this.handleReload}
              className="mt-5 w-full h-11 rounded-xl bg-neutral-950 text-white text-sm font-black"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
