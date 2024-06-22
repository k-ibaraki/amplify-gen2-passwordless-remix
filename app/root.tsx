import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import "@aws-amplify/ui-react/styles.css";
import { useState, useEffect } from "react";

import { Passwordless, Fido2Toast } from "amazon-cognito-passwordless-auth/react";
import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react'

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return children;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>
          <PasswordlessContextProvider enableLocalUserCache={true}>
            <Passwordless>
              {children}
            </Passwordless>
            <Fido2Toast />
          </PasswordlessContextProvider>
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}