import type { MetaFunction } from "@remix-run/node";
import { usePasswordless } from "amazon-cognito-passwordless-auth/react";

// Fido2CredentialsComponent
function Fido2Credentials() {
  const { fido2Credentials, signOut, tokens } = usePasswordless();
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };
  return (
    <div>
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div>------
        <ul>
        {fido2Credentials?.map((c) => (
          <li>
            <button onClick={() => c.delete()}>Delete PassKey[{c.friendlyName}]</button>
          </li>
        ))}
        </ul>
      </div>
      <div>------
        <div>accessToken: {tokens?.accessToken}</div>
        <div>idToken: {tokens?.idToken}</div>
        <div>refreshToken: {tokens?.refreshToken}</div>
      </div>

    </div>
  );
  }

export const meta: MetaFunction = () => {
  return [
    { title: "Amplify Gen2 Passwordless with Remix(SPA Mode)" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Passkey Sample</h1>
      <Fido2Credentials />
    </div>    
  );
}
