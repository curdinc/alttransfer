"use client";
import { Account } from "src/components/Account";
import { Balance } from "src/components/Balance";
import { BlockNumber } from "src/components/BlockNumber";
import { Connect } from "src/components/Connect";
import { Connected } from "src/components/Connected";
import { NetworkSwitcher } from "src/components/NetworkSwitcher";
import { ReadContract } from "src/components/ReadContract";
import { ReadContracts } from "src/components/ReadContracts";
import { ReadContractsInfinite } from "src/components/ReadContractsInfinite";
import { SendTransaction } from "src/components/SendTransaction";
import { SendTransactionPrepared } from "src/components/SendTransactionPrepared";
import { SignMessage } from "src/components/SignMessage";
import { SignTypedData } from "src/components/SignTypedData";
import { Token } from "src/components/Token";
import { WatchContractEvents } from "src/components/WatchContractEvents";
import { WatchPendingTransactions } from "src/components/WatchPendingTransactions";
import { WriteContract } from "src/components/WriteContract";
import { WriteContractPrepared } from "src/components/WriteContractPrepared";

export default function Page() {
  return (
    <div>
      <h1>wagmi + Next.js</h1>
      <Connect />
      <Connected>
        <hr />
        <h2>Network</h2>
        <NetworkSwitcher />
        <br />
        <hr />
        <h2>Account</h2>
        <Account />
        <br />
        <hr />
        <h2>Balance</h2>
        <Balance />
        <br />
        <hr />
        <h2>Block Number</h2>
        <BlockNumber />
        <br />
        <hr />
        <h2>Read Contract</h2>
        <ReadContract />
        <br />
        <hr />
        <h2>Read Contracts</h2>
        <ReadContracts />
        <br />
        <hr />
        <h2>Read Contracts Infinite</h2>
        <ReadContractsInfinite />
        <br />
        <hr />
        <h2>Send Transaction</h2>
        <SendTransaction />
        <br />
        <hr />
        <h2>Send Transaction (Prepared)</h2>
        <SendTransactionPrepared />
        <br />
        <hr />
        <h2>Sign Message</h2>
        <SignMessage />
        <br />
        <hr />
        <h2>Sign Typed Data</h2>
        <SignTypedData />
        <br />
        <hr />
        <h2>Token</h2>
        <Token />
        <br />
        <hr />
        <h2>Watch Contract Events</h2>
        <WatchContractEvents />
        <br />
        <hr />
        <h2>Watch Pending Transactions</h2>
        <WatchPendingTransactions />
        <br />
        <hr />
        <h2>Write Contract</h2>
        <WriteContract />
        <br />
        <hr />
        <h2>Write Contract (Prepared)</h2>
        <WriteContractPrepared />
      </Connected>
    </div>
  );
}
