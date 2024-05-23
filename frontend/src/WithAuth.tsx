import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isSignIn: boolean;
  redirectTo: string;
  component: ReactNode;
}

export const WithAuth = ({ isSignIn, redirectTo, component }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignIn === false) {
      navigate(redirectTo);
    }
  }, [isSignIn, navigate, redirectTo]);

  return component;
};
