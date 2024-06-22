import type { MetaFunction } from "@remix-run/node";
import { usePasswordless } from "amazon-cognito-passwordless-auth/react";

// LogoutButton
function LogoutButton() {
  const { signOut } = usePasswordless();
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };
  return (
    <div>
      <button onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  );
}

// DeleteFido2CredentialsComponent
function DeleteFido2Credentials() {
  const { fido2Credentials, signOut } = usePasswordless();
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };
  return (
    <div>
      <div>
        <ul>
        {fido2Credentials?.map((c) => (
          <li>
            <button onClick={() => c.delete()}>Delete PassKey : {c.friendlyName}</button>
          </li>
        )) ?? <></>}
        </ul>
      </div>
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
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
      <h1 className="text-3xl">Welcome to Remix (SPA Mode)</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/guides/spa-mode"
            rel="noreferrer"
          >
            SPA Mode Guide
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
      <DeleteFido2Credentials />
    </div>    
  );
}
