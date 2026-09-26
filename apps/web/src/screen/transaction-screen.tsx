import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../components/modal";

import { Spinner } from "../components/spinner";
import { useAccount, useTransactions } from "@cbdc-markka/utils-react";
import { AppScreen } from "../components/app-screen";
import { ArrowDownCircle, ArrowUpCircle, Check, ContainerIcon, Pencil } from "lucide-react";
import { useClassName } from "../hooks/use-class-name";
import { Button } from "../components/button";
import { useState } from "react";
import { Core } from "@cbdc-markka/core";
import { lang } from "../util/lang";
import { useAppContext } from "../providers/app-provider";
import { NativeBannerAd } from "../components/ad";

export function TransactionScreen() {
  const navigate = useNavigate();
  const { account, isPending } = useAccount();
  const { id } = useParams();
  const [status, setStatus] = useState("uncopied");
  const { selectedLanguage } = useAppContext();
  const transaction = account?.transactions.find((t) => t.id === id);
  const isReceived = ["mint", "input"].includes(transaction.type);

  const Symbol = () => {
    const color = isReceived ? "var(--color-green-600)" : "var(--color-red-600)";
    const Component = isReceived ? ArrowDownCircle : ArrowUpCircle;
    return <Component color={color} size='3rem' />;
  };

  const AmountText = () => {
    const textClassName = useClassName(isReceived ? "text-green-600" : "text-red-600");

    const amt = Core.convertCurrencyAmount(transaction?.amount_in_cents || 0);
    return (
      <div className={textClassName}>
        {Core.amountToString(isReceived ? amt : -amt, "always")} mk
      </div>
    );
  };

  const copyId = async () => {
    if (!transaction || transaction.type === "mint") return;

    try {
      setStatus("loading");
      const data = transaction.foreign_transaction?.account_id;
      await navigator.clipboard.writeText(data);
      setStatus("copied");
    } catch (err) {
      console.log(err.message);
    } finally {
      setStatus((prev) => (prev === "loading" ? "uncopied" : prev));
    }
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <AppScreen title={"Transaction"} onClose={() => navigate("/auth/overview")}>
      <main className='flex flex-col w-full gap-4 items-center h-pad bg-white flex-1 justify-center'>
        <Symbol />
        <h2 className='font-semibold text-lg'>Transaction</h2>
        <div className='flex flex-col w-full text-sm'>
          <div className='flex flex-col py-1'>
            <span className='font-semibold text-sm'>ID</span>
            <span className='font-mono text-sm'>{transaction?.id}</span>
          </div>
          <div className='flex flex-col py-1'>
            <span className='font-semibold text-sm'>{isReceived ? "Sender" : "Recipient"}</span>
            <span>
              {" "}
              {transaction?.type !== "mint"
                ? transaction?.foreign_transaction?.email
                : "e-MRK Mint"}
            </span>
          </div>
          <div className='flex flex-col py-1'>
            <span className='font-semibold text-sm'>Message</span>
            <span> {transaction?.message || "No message."}</span>
          </div>
        </div>
        <div className='w-full border-b border-dashed border-gray-500' />
        <table className='w-full'>
          <tbody className='font-mono'>
            <tr className='px-2 py-1'>
              <td>Amount</td>
              <td className='text-right'>
                <AmountText />
              </td>
            </tr>

            <tr className='bg-slate-200'>
              <td>Date</td>
              <td className='text-right'>
                {new Date(transaction?.created_at).toLocaleDateString("fi")}
              </td>
            </tr>
          </tbody>
        </table>

        <Button
          onClick={copyId}
          disabled={status === "loading" || status === "copied"}
          color={status === "copied" ? "success" : "primary"}
          type='button'
          variant='outlined'
          rounded
        >
          {status === "copied" ? (
            <Check size='1rem' color='var(--color-green-600)' />
          ) : (
            <Pencil size='1rem' color={"var(--color-primary)"} />
          )}

          {status === "copied" ? "ID Copied" : isReceived ? "Copy sender ID" : "Copy recipient ID"}
        </Button>
        <NativeBannerAd />
      </main>
    </AppScreen>
  );
}
