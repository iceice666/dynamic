import { StrictMode, type ComponentType } from 'react';

export default function withStrictMode<P extends object>(Component: ComponentType<P>) {
  return function StrictModeWrapper(props: P) {
    return (
      <StrictMode>
        <Component {...props} />
      </StrictMode>
    );
  };
}
