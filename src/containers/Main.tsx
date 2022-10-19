import React from 'react';

interface Props {
  children: React.ReactNode;
}

function Main({ children }: Props) {
  return <>{children}</>;
}

export default Main;
