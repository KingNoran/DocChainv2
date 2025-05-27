"use client";

import React, { useState, useEffect } from 'react';


const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const connectWallet = async () => {
		setLoading(true);
    
    try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			setAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		} finally {
      setLoading(false);
    }
	};

  const checkIfWalletIsConnected = async () => {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_accounts",
			});

			if (accounts.length > 0) {
				setAccount(accounts[0]);
				console.log("Connected account:", accounts[0]);
			} else {
				console.log("No accounts found");
			}
		} catch (error) {
			console.log(error);
		}
	};

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      <div>
				{!account ? (
					<button
						type="button"
						onClick={connectWallet}
            disabled={isLoading}
					>
						{isLoading ? "Connecting..." : "Connect Wallet"}
					</button>
				) : (<p>Connected Wallet: {account}</p>)}
			</div>
    </div>
  )
}

export default ConnectWallet
