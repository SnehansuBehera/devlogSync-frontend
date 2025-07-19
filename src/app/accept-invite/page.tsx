// app/accept-invite/page.ts
import { Suspense } from "react";
import AcceptInvitePage from "./AcceptInvitePage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="text-center mt-10">Processing your invitation...</p>
      }
    >
      <AcceptInvitePage />
    </Suspense>
  );
}
