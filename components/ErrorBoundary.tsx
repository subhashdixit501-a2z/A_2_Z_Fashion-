import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorStack: string;
  errorName: string;
  componentStack: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
    errorStack: "",
    errorName: "",
    componentStack: "",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "Unknown error",
      errorStack: error?.stack || "",
      errorName: error?.name || "Error",
      componentStack: "",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("A2Z DEBUG ERROR:", error);
    console.error("Component Stack:", errorInfo?.componentStack);

    this.setState({
      errorMessage: error?.message || "Unknown error",
      errorStack: error?.stack || "",
      errorName: error?.name || "Error",
      componentStack: errorInfo?.componentStack || "",
    });
  }

  componentDidMount() {
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
  }

  handleGlobalError = (event: ErrorEvent) => {
    console.error("Global Error:", event.error || event.message);

    this.setState({
      hasError: true,
      errorName: event.error?.name || "GlobalError",
      errorMessage: event.message || "Unknown global error",
      errorStack: event.error?.stack || "",
      componentStack: "",
    });
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;

    console.error("Unhandled Promise Rejection:", reason);

    this.setState({
      hasError: true,
      errorName: reason?.name || "UnhandledPromiseRejection",
      errorMessage:
        reason?.message ||
        String(reason) ||
        "Unhandled promise rejection",
      errorStack: reason?.stack || "",
      componentStack: "",
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-neutral-200 p-5 shadow-lg">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-sm font-black">
              A2Z
            </div>

            <h1 className="mt-4 text-xl font-black text-neutral-900 text-center">
              A_2_Z_Fashion Error
            </h1>

            <p className="mt-2 text-xs text-neutral-500 text-center">
              NEW DEBUG VERSION
            </p>

            <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-4">
              <p className="text-xs font-bold text-red-700 mb-2">
                ERROR NAME
              </p>

              <p className="text-sm text-red-900 break-words">
                {this.state.errorName}
              </p>

              <p className="text-xs font-bold text-red-700 mt-4 mb-2">
                ERROR MESSAGE
              </p>

              <p className="text-sm text-red-900 break-words whitespace-pre-wrap">
                {this.state.errorMessage}
              </p>
            </div>

            {this.state.errorStack && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-bold text-neutral-800">
                  Show Error Stack
                </summary>

                <pre className="mt-3 p-3 rounded-xl bg-neutral-900 text-green-300 text-[10px] leading-4 overflow-auto max-h-64 whitespace-pre-wrap break-words">
                  {this.state.errorStack}
                </pre>
              </details>
            )}

            {this.state.componentStack && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-bold text-neutral-800">
                  Show Component Stack
                </summary>

                <pre className="mt-3 p-3 rounded-xl bg-neutral-900 text-yellow-300 text-[10px] leading-4 overflow-auto max-h-64 whitespace-pre-wrap break-words">
                  {this.state.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReload}
              className="mt-5 w-full h-12 rounded-xl bg-neutral-950 text-white text-sm font-black"
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
