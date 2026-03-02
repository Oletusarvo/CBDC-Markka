import { Spinner } from '../components/spinner';

export function withLoader(Component) {
  return ({ children, loading, ...props }) => {
    return <Component {...props}>{loading ? <Spinner /> : children}</Component>;
  };
}
