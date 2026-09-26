import { useEffect, useState } from "react";
import { Spinner, SpinnerTimer } from "../components/spinner";
import { AppIcon } from "../components/app-icon";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { NoticeScreen } from "../components/notice-screen";

export function SessionLoadingScreen() {
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  useEffect(() => {
    const i = setInterval(() => {
      setTimer((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, [setTimer]);

  return (
    <NoticeScreen
      title='Loading'
      bodyText='Your session is loading. This may take a minute...'
      footer={
        //Render inside a div to prevent the button from taking up the entire width of the screen.
        <div>
          <Button onClick={() => navigate("/")} variant='outlined' rounded>
            Return to the home page
          </Button>
        </div>
      }
    >
      <SpinnerTimer currentValue={timer} />
    </NoticeScreen>
  );
}
