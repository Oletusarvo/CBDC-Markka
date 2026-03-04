import React from 'react';

export function PassProps({ children, ...props }: React.PropsWithChildren & any) {
  return React.Children.map(children, (child: any) => {
    return React.cloneElement(child, {
      ...child.props,
      ...props,
    });
  });
}
