import { Mail } from "lucide-react";
import { AppScreen } from "../components/app-screen";
import { Button, LoaderButton } from "../components/button";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/use-logout";
import { NoticeScreen } from "../components/notice-screen";
import { useSession } from "@cbdc-markka/utils-react";

export function PendingUserScreen() {
  const { handleSignout, status, pending } = useLogout();
  const { session } = useSession();
  const navigate = useNavigate();

  const abortButton = (
    <LoaderButton
      loading={pending}
      disabled={pending || status === "success"}
      onClick={session ? handleSignout : () => navigate(-1)}
      rounded
      variant='ghost'
    >
      {session ? "Log out" : "Cancel"}
    </LoaderButton>
  );

  return (
    <NoticeScreen
      title='Verify your email'
      bodyText='You have not yet verified your email. Please click the link in the email we sent you. Unverified accounts are deleted after 24 hours.'
      footer={
        <div className='flex flex-col gap-4 justify-center w-full'>
          <LoaderButton
            loading={false}
            disabled={pending || status === "success"}
            type='button'
            rounded
            shadow
          >
            Send Verification Link
          </LoaderButton>
          {abortButton}
        </div>
      }
    ></NoticeScreen>
  );
}
